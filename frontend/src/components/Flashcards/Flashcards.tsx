import { useState, useRef, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import FileDropZone from '../FileUpload/FileDropZone'
import FileList from '../FileUpload/FileList'
import Button from '../Button'
import { validateFile } from '../helpers'

type Flashcard = {
  question: string
  answer: string
}

interface FileObject {
  file: File
  id: number
  preview: string | null
}

interface Errors {
  [key: string]: string
}

interface UploadResponse {
  file_id: string
  filename: string
  saved_as: string
  success: string
}

interface FlashcardsProps {
  API_BASE_URL: string
}

function Flashcards({ API_BASE_URL }: FlashcardsProps) {
  // --- File Upload State ---
  const [files, setFiles] = useState<FileObject[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(
    undefined
  )

  // --- Flashcards State ---
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loadingFlashcards, setLoadingFlashcards] = useState(false)
  const [flashcardsError, setFlashcardsError] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // --- File Upload Config ---
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const MAX_FILES = 1

  // --- Process Files ---
  const processFiles = (newFiles: FileList | File[]): void => {
    const fileArray = Array.from(newFiles)
    const validationErrors: Errors = {}
    const validFiles: FileObject[] = []

    if (files.length + fileArray.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files`)
      return
    }

    fileArray.forEach((file, index) => {
      const error = validateFile(file, MAX_FILE_SIZE, ALLOWED_TYPES)
      if (error) {
        validationErrors[file.name] = error
      } else {
        validFiles.push({
          file,
          id: Date.now() + index,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : null,
        })
      }
    })

    setErrors(validationErrors)
    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      processFiles(e.target.files)
  }

  const removeFile = (id: number) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview)
      return prev.filter((f) => f.id !== id)
    })
  }

  const clearAll = () => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    setFiles([])
    setErrors({})
    setUploadedFileId(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- Upload Handler ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setUploading(true)
    setErrors({})

    for (const fileObj of files) {
      const formData = new FormData()
      formData.append('file', fileObj.file)

      try {
        const response = await axios.post<UploadResponse>(
          `http://${API_BASE_URL}/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        setUploadedFileId(response.data.saved_as)
      } catch {
        setErrors((prev) => ({ ...prev, [fileObj.file.name]: 'Upload failed' }))
      }
    }

    setUploading(false)
  }

  // --- Fetch Flashcards ---
  useEffect(() => {
    if (!API_BASE_URL || !uploadedFileId) return
    let cancelled = false
    setLoadingFlashcards(true)
    setFlashcardsError(null)
    setFlashcards([])

    const base = API_BASE_URL.startsWith('http')
      ? API_BASE_URL
      : `http://${API_BASE_URL}`

    axios
      .get(`${base}/generate_flashcards/${uploadedFileId}`)
      .then((res) => {
        if (cancelled) return
        setFlashcards(res.data?.flashcards ?? [])
      })
      .catch((err) => {
        if (cancelled) return
        setFlashcardsError(err?.message ?? 'Failed to load flashcards')
      })
      .finally(() => {
        if (!cancelled) setLoadingFlashcards(false)
      })

    return () => {
      cancelled = true
    }
  }, [API_BASE_URL, uploadedFileId])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-10">
      <div className="flex flex-col lg:flex-row justify-center gap-8 px-4 lg:px-16">
        {/* Upload Panel */}
        <div className="flex-1 max-w-lg bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <FileDropZone
              dragging={dragging}
              setDragging={setDragging}
              handleFileChange={handleFileChange}
              processFiles={processFiles}
              fileInputRef={fileInputRef}
              uploading={uploading}
              maxFiles={MAX_FILES}
              maxFileSize={MAX_FILE_SIZE}
              allowedTypes={ALLOWED_TYPES}
            />

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-900 text-red-400 p-3 rounded mt-4">
                {Object.values(errors).map((err, i) => (
                  <p key={i} className="text-sm">
                    ⚠️ {err}
                  </p>
                ))}
              </div>
            )}

            <FileList
              files={files}
              uploading={uploading}
              removeFile={removeFile}
              clearAll={clearAll}
            />

            <Button
              files={files}
              state={loadingFlashcards}
              text="Flash!"
              loadingText="Flashing..."
            />
          </form>
        </div>

        {/* Flashcards Panel */}
        <div className="flex-1 max-w-lg p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-3">Flashcards</h3>

          {!uploadedFileId && (
            <p className="text-sm text-gray-400">No file uploaded yet.</p>
          )}

          {loadingFlashcards && (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
          {flashcardsError && (
            <p className="text-sm text-red-400">Error: {flashcardsError}</p>
          )}
          {!loadingFlashcards &&
            !flashcardsError &&
            flashcards.length === 0 &&
            uploadedFileId && (
              <p className="text-sm text-gray-400">No flashcards returned.</p>
            )}

          <ul className="space-y-3">
            {flashcards.map((fc, i) => (
              <li
                key={i}
                className="border border-gray-700 rounded p-3 cursor-pointer bg-gray-900"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      Q: {fc.question}
                    </p>
                    {openIndex === i && (
                      <p className="mt-2 text-sm text-gray-300">
                        A: {fc.answer}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {openIndex === i ? 'Hide' : 'Show'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
