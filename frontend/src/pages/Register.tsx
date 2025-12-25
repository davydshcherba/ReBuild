import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.register({ username, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-br from-purple-500/10 via-transparent to-transparent animate-pulse"></div>
      <div className="bg-white rounded-3xl p-12 w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-gray-700 text-sm mb-6 opacity-70 hover:opacity-100 hover:-translate-x-1 transition-all">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-700 opacity-70 text-base">
            Sign up to get started
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-gray-900 font-semibold text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              className="px-5 py-3.5 border-2 border-gray-300 rounded-xl text-base bg-white text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-900 font-semibold text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="px-5 py-3.5 border-2 border-gray-300 rounded-xl text-base bg-white text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-900 font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              className="px-5 py-3.5 border-2 border-gray-300 rounded-xl text-base bg-white text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-6 pt-6 border-t border-gray-300">
            <p className="text-gray-700 opacity-70 text-sm m-0">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-600 hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

