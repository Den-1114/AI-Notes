import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import FileDropZone from '../FileUpload/FileDropZone'
import FileList from '../FileUpload/FileList'
import Button from '../Button'
import { validateFile } from '../helpers'
import rightArrowImg from '../../assets/right-arrow.svg'
import leftArrowImg from '../../assets/left-arrow.svg'

type Flashcard = { question: string; answer: string }

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
  const [files, setFiles] = useState<FileObject[]>([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [uploadedFileId, setUploadedFileId] = useState<string>()
  const [dragging, setDragging] = useState(false)

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---- File processing ----
  const processFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    const valid: FileObject[] = []
    const errs: Errors = {}

    arr.forEach((file, i) => {
      const error = validateFile(file, 10 * 1024 * 1024, [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ])
      if (error) errs[file.name] = error
      else valid.push({ file, id: Date.now() + i, preview: null })
    })

    setErrors(errs)
    setFiles(valid)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files)
  }

  // ---- Uploading ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files.length) return alert('Please select a file')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', files[0].file)

    try {
      const res = await axios.post<UploadResponse>(
        `http://${API_BASE_URL}/upload`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setUploadedFileId(res.data.saved_as)
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
  }

  // ---- Fetch flashcards ----
  useEffect(() => {
    if (!uploadedFileId) return
    setLoading(true)
    setError(null)

    axios
      .get(`http://${API_BASE_URL}/generate_flashcards/${uploadedFileId}`)
      .then((res) => {
        setFlashcards(res.data.flashcards ?? [])
        setCurrentIndex(0)
      })
      .catch(() => setError('Could not generate flashcards'))
      .finally(() => setLoading(false))
  }, [uploadedFileId])

  // ---- Navigation ----
  const current = flashcards[currentIndex]
  const next = () => {
    setShowAnswer(false)
    setCurrentIndex((i) => Math.min(i + 1, flashcards.length - 1))
  }
  const prev = () => {
    setShowAnswer(false)
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }

  // ---- UI ----
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 py-10 overflow-hidden">
      {/* Floating background glows */}
      <div className="absolute top-20 left-1/4 w-[32rem] h-[32rem] bg-purple-700/10 blur-[120px] rounded-full animate-floatGlow"></div>
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-blue-700/10 blur-[130px] rounded-full animate-floatGlow"></div>

      <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-center gap-8 px-4 lg:px-16 z-10">
        {/* Upload section */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-gray-800 rounded-2xl p-6 shadow flex flex-col"
        >
          <FileDropZone
            dragging={dragging}
            setDragging={setDragging}
            handleFileChange={handleFileChange}
            processFiles={processFiles}
            fileInputRef={fileInputRef}
            uploading={uploading}
            maxFiles={1}
            maxFileSize={10 * 1024 * 1024}
            allowedTypes={[
              'application/pdf',
              'text/plain',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ]}
          />
          {Object.keys(errors).length > 0 && (
            <div className="mt-3 text-red-400 text-sm space-y-1">
              {Object.values(errors).map((err, i) => (
                <p key={i}>⚠️ {err}</p>
              ))}
            </div>
          )}
          <FileList
            files={files}
            uploading={uploading}
            removeFile={() => setFiles([])}
            clearAll={() => setFiles([])}
          />
          <div className="mt-4">
            <Button
              files={files}
              text="Flashcard It!"
              loadingText="Flashcarding..."
              state={loading}
            />
          </div>
        </form>

        {/* Flashcard section */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 shadow flex flex-col items-center justify-center">
          {loading && <p>Loading flashcards...</p>}
          {!loading && error && <p className="text-red-400">Error: {error}</p>}
          {!loading && !error && !flashcards.length && (
            <p className="text-gray-400 text-center text-sm">
              {uploadedFileId
                ? 'No flashcards returned.'
                : 'Upload a file to start ✨'}
            </p>
          )}

          {!loading && !error && flashcards.length > 0 && (
            <>
              <div
                className="bg-gray-700 w-full h-48 rounded-2xl flex items-center justify-center text-center cursor-pointer select-none"
                onClick={() => setShowAnswer((p) => !p)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showAnswer ? 'answer' : 'question'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-medium"
                  >
                    {showAnswer
                      ? `A: ${current.answer}`
                      : `Q: ${current.question}`}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between w-full mt-4">
                <button
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-gray-700 rounded-2xl disabled:opacity-40 flex items-center"
                >
                  <img
                    src={leftArrowImg}
                    alt="Prev"
                    className="w-4 h-4 inline-block mr-2"
                  />
                  Prev
                </button>
                <span className="text-gray-400 text-sm">
                  {currentIndex + 1} / {flashcards.length}
                </span>
                <button
                  onClick={next}
                  disabled={currentIndex === flashcards.length - 1}
                  className="px-4 py-2 bg-gray-700 rounded-2xl disabled:opacity-40 flex items-center"
                >
                  Next
                  <img
                    src={rightArrowImg}
                    alt="Next"
                    className="w-4 h-4 inline-block ml-2"
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Flashcards
