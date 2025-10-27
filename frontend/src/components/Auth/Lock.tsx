import { useEffect } from 'react'

interface Props {
  redirectPath?: string
  message?: string
}

function LockPage({
  redirectPath = '/login',
  message = 'You need to be logged in to access this page',
}: Props) {
  useEffect(() => {
    // Optional: Clear any existing auth tokens
    localStorage.removeItem('token')
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-10">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">
          Access Locked
        </h2>

        <p className="text-gray-400 text-center mb-6">{message}</p>

        {/* Additional Info */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 text-center">
            🔒 Your session may have expired or you haven't signed in yet
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => (window.location.href = redirectPath)}
            className="bg-blue-600 hover:bg-blue-700 rounded py-3 font-medium text-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In to Continue
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 rounded py-3 font-medium text-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Help Link */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Need help?
          <a href="/support" className="text-blue-400 hover:underline ml-1">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}

export default LockPage
