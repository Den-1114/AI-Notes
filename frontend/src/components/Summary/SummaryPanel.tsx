import MarkdownVisualizer from './MdVisualizer'

interface Props {
  summary: string
}

function SummaryPanel({ summary }: Props) {
  console.log(summary)
  return (
    <div className="flex-1 max-w-2xl bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <MarkdownVisualizer markdown={summary || 'Upload a file to start ✨'} />
    </div>
  )
}

export default SummaryPanel
