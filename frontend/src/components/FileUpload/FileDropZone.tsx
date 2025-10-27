import type { DragEvent, ChangeEvent, RefObject } from 'react'

interface Props {
  dragging: boolean
  setDragging: (val: boolean) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  processFiles: (files: FileList) => void
  fileInputRef: RefObject<HTMLInputElement>
  uploading: boolean
  maxFiles: number
  maxFileSize: number
  allowedTypes: string[]
}

function FileDropZone({
  dragging,
  setDragging,
  handleFileChange,
  processFiles,
  fileInputRef,
  uploading,
  maxFiles,
  maxFileSize,
  allowedTypes,
}: Props) {
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }
  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
        dragging ? 'border-blue-400 bg-blue-900' : 'border-gray-600 bg-gray-800'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        disabled={uploading}
      />
      <div className="text-5xl mb-2">📁</div>
      <p className="text-gray-300 font-medium">
        Drag & drop files here, or click to select
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Max {maxFiles} files • Max {maxFileSize / (1024 * 1024)} MB each •
        Allowed: PDF, TXT, DOC, DOCX
      </p>
    </div>
  )
}

export default FileDropZone
