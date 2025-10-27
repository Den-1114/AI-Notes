import { useState } from 'react'
import axios from 'axios'

interface Props {
  API_BASE_URL: string
}

function LoginPage({ API_BASE_URL }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(
        `http://${API_BASE_URL}/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )

      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token)
      } else {
        setError('Invalid response from server')
      }
      window.location.href = '/summary'
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.')
      } else if (err.response?.status === 401) {
        setError('Invalid username or password')
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-10">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {error && (
          <div className="bg-red-900 text-red-400 p-3 rounded mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-medium text-gray-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?
          <a href="/signup" className="text-blue-400 hover:underline ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
