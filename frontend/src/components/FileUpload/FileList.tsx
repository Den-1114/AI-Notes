import FileItem from './FileItem'

interface FileObject {
  file: File
  id: number
  preview: string | null
}

interface Props {
  files: FileObject[]
  uploading: boolean
  removeFile: (id: number) => void
  clearAll: () => void
}

function FileList({
  files,

  uploading,
  removeFile,
  clearAll,
}: Props) {
  if (files.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">
          Selected Files ({files.length})
        </h3>
        <button
          type="button"
          onClick={clearAll}
          disabled={uploading}
          className="px-3 py-1 text-sm border rounded-xl hover:bg-gray-700 disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {files.map((fileObj) => (
          <FileItem
            key={fileObj.id}
            fileObj={fileObj}
            uploading={uploading}
            removeFile={removeFile}
          />
        ))}
      </div>
    </div>
  )
}

export default FileList
