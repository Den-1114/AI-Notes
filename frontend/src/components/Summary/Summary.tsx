import { useState, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import FileDropZone from '../FileUpload/FileDropZone'
import FileList from '../FileUpload/FileList'
import Button from '../Button'
import SummaryPanel from './SummaryPanel'
import { validateFile } from '../helpers'

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

interface MultipleFilesResponse {
  files: UploadResponse[]
}

function CompleteFileUpload({ API_BASE_URL }: { API_BASE_URL: string }) {
  const [files, setFiles] = useState<FileObject[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [multipleResponseMessage, setMultipleResponseMessage] =
    useState<MultipleFilesResponse | null>(null)
  const [summary, setSummary] = useState<string>('')

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const MAX_FILES = 1

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setMultipleResponseMessage(null)
    setUploading(true)
    setErrors({})

    for (const fileObj of files) {
      const formData = new FormData()
      formData.append('file', fileObj.file)

      try {
        // Upload
        const response = await axios.post<UploadResponse>(
          `http://${API_BASE_URL}/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )

        // Summary
        const summaryResponse = await axios.get(
          `http://${API_BASE_URL}/generate_summary/${response.data.saved_as}`
        )
        setSummary(summaryResponse.data.summary)

        setMultipleResponseMessage((prev) => ({
          files: prev?.files ? [...prev.files, response.data] : [response.data],
        }))
      } catch (error) {
        console.error(`Error uploading ${fileObj.file.name}:`, error)
        setErrors((prev) => ({
          ...prev,
          [fileObj.file.name]: 'Upload or summary generation failed',
        }))
      }
    }

    setUploading(false)
  }

  const removeFile = (id: number): void => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview)
      return prev.filter((f) => f.id !== id)
    })
  }

  const clearAll = (): void => {
    files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    setFiles([])
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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

            {/* Errors */}
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
              state={uploading}
              text="Sum Up!"
              loadingText="Summing up..."
            />
          </form>
        </div>
        {/* Summary Panel */}
        <SummaryPanel summary={summary} />
      </div>
    </div>
  )
}

export default CompleteFileUpload
