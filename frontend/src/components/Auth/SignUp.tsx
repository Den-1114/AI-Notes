import { useState } from 'react'
import axios from 'axios'

interface Props {
  API_BASE_URL: string
}

function SignupPage({ API_BASE_URL }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        `http://${API_BASE_URL}/signup`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )

      setSuccess(res.data.message || 'Account created successfully')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center py-10">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {error && (
          <div className="bg-red-900 text-red-400 p-3 rounded mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900 text-green-400 p-3 rounded mb-4">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 rounded py-2 font-medium text-gray-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?
          <a href="/login" className="text-blue-400 hover:underline ml-1">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
