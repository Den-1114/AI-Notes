import React from 'react'
import MarkdownIt from 'markdown-it'
import markdownItMark from 'markdown-it-mark'
import DOMPurify from 'dompurify'
import 'github-markdown-css/github-markdown.css'

interface MarkdownVisualizerProps {
  markdown: string
}

// Create Markdown-It instance with GFM-like features
const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
md.use(markdownItMark) // supports ==mark== syntax

const MarkdownVisualizer: React.FC<MarkdownVisualizerProps> = ({
  markdown,
}) => {
  // Memoize rendered HTML for performance
  const renderedHTML = React.useMemo(() => {
    const rawHTML = md.render(markdown)
    return DOMPurify.sanitize(rawHTML)
  }, [markdown])

  return (
    <div
      className="markdown-body prose max-w-full overflow-y-auto p-4 bg-white rounded-2xl shadow"
      style={{ maxHeight: '80vh' }}
      dangerouslySetInnerHTML={{ __html: renderedHTML }}
    />
  )
}

export default MarkdownVisualizer
