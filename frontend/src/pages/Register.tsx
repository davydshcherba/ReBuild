import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.register({ 
        username, 
        email, 
        password,
        weight: parseFloat(weight) || 0,
        height: parseFloat(height) || 0,
        age: parseInt(age) || 0
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/20 animate-pulse"></div>
      
      <div className="glass-effect rounded-3xl p-12 w-full max-w-md border border-pink-500/30 neon-glow-pink relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-pink-300 text-sm mb-6 opacity-70 hover:opacity-100 hover:-translate-x-1 transition-all font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2 text-glow">
            Create Account
          </h1>
          <p className="text-gray-300 opacity-70 text-base font-light">
            Sign up to get started
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="glass-effect bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/30 text-sm text-center neon-glow-pink">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-pink-300 font-semibold text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-pink-300 font-semibold text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-pink-300 font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
              minLength={6}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="weight" className="text-pink-300 font-semibold text-sm">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="70"
                step="0.1"
                min="0"
                className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="height" className="text-pink-300 font-semibold text-sm">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                placeholder="175"
                step="0.1"
                min="0"
                className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="age" className="text-pink-300 font-semibold text-sm">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                placeholder="25"
                min="1"
                max="120"
                className="px-5 py-3.5 glass-effect border-2 border-pink-500/30 rounded-xl text-base text-white placeholder-gray-500 focus:border-pink-400 focus:neon-glow-pink focus:ring-4 focus:ring-pink-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl text-lg font-semibold hover:-translate-y-0.5 neon-glow hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 mt-2 pulse-glow"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-6 pt-6 border-t border-pink-500/30">
            <p className="text-gray-300 opacity-70 text-sm m-0 font-light">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-300 font-semibold hover:text-pink-200 hover:underline transition-colors text-glow-pink">
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

