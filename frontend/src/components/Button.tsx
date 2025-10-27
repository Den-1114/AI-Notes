interface Props {
  files: { file: File; id: number; preview: string | null }[]
  state: boolean
  text?: string
  loadingText?: string
  children?: React.ReactNode
}

function Button({ state, text, loadingText, children }: Props) {
  return (
    <button
      type="submit"
      disabled={state}
      className={`w-full py-3 mt-6 rounded-2xl font-medium text-white transition-colors ${
        state
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {children}
      {state ? loadingText : text}
    </button>
  )
}

export default Button
