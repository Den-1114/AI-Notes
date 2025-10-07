import MarkdownVisualizer from './MdVisualizer'

interface Props {
  summary: string
}

function SummaryPanel({ summary }: Props) {
  return (
    <div className="flex-1 max-w-2xl bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <MarkdownVisualizer markdown={summary || 'No summary generated yet.'} />
    </div>
  )
}

export default SummaryPanel
