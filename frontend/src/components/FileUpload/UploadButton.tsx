interface Props {
  files: { file: File; id: number; preview: string | null }[]
  uploading: boolean
}

function UploadButton({ files, uploading }: Props) {
  if (files.length === 0) return null

  return (
    <button
      type="submit"
      disabled={uploading}
      className={`w-full py-3 mt-6 rounded font-medium text-white transition-colors ${
        uploading
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {uploading
        ? 'Summarizing...'
        : `Summarize ${files.length} file${files.length > 1 ? 's' : ''}`}
    </button>
  )
}

export default UploadButton
