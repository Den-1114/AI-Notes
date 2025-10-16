import { formatFileSize } from '../helpers'

interface FileObject {
  file: File
  id: number
  preview: string | null
}

interface Props {
  fileObj: FileObject
  progress?: number
  uploading: boolean
  removeFile: (id: number) => void
}

function FileItem({ fileObj, uploading, removeFile }: Props) {
  return (
    <div className="border rounded p-3 bg-gray-700 flex items-center gap-3 shadow-sm">
      {fileObj.preview ? (
        <img
          src={fileObj.preview}
          alt={fileObj.file.name}
          className="w-14 h-14 object-cover rounded"
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center bg-gray-600 rounded text-2xl">
          📄
        </div>
      )}

      <div className="flex-1">
        <div className="font-medium text-sm">{fileObj.file.name}</div>
        <div className="text-xs text-gray-400">
          {formatFileSize(fileObj.file.size)}
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeFile(fileObj.id)}
        disabled={uploading}
        className="px-2 py-1 border rounded text-lg hover:bg-gray-600 disabled:opacity-50"
      >
        ❌
      </button>
    </div>
  )
}

export default FileItem
