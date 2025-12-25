import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.login({ username, password })
      navigate('/')
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-pink-500/20 animate-pulse"></div>
      
      <div className="glass-effect rounded-3xl p-12 w-full max-w-md border border-purple-500/30 neon-glow relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-cyan-300 text-sm mb-6 opacity-70 hover:opacity-100 hover:-translate-x-1 transition-all font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 text-glow">
            Welcome Back
          </h1>
          <p className="text-gray-300 opacity-70 text-base font-light">
            Sign in to your account to continue
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="glass-effect bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/30 text-sm text-center neon-glow-pink">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-cyan-300 font-semibold text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="px-5 py-3.5 glass-effect border-2 border-cyan-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-cyan-400 focus:neon-glow-cyan focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-cyan-300 font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="px-5 py-3.5 glass-effect border-2 border-cyan-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-cyan-400 focus:neon-glow-cyan focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-xl text-lg font-semibold hover:-translate-y-0.5 neon-glow hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 mt-2 pulse-glow"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-6 pt-6 border-t border-purple-500/30">
            <p className="text-gray-300 opacity-70 text-sm m-0 font-light">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-300 font-semibold hover:text-cyan-200 hover:underline transition-colors text-glow-cyan">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

