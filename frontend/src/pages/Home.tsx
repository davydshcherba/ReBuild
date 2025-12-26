import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, User } from '../utils/api'

const Home = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [typedText, setTypedText] = useState('')
  const fullText = 'Inteligencia Artificial|'
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.getMe()
        setUser(userData)
      } catch (error) {
        // User not authenticated
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      <header className="glass-effect sticky top-0 z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-glow">
            ReBuild
          </h1>
          <nav className="flex gap-6 items-center">
            {user ? (
              <>
                <Link to="/calendar" className="text-cyan-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30">
                  Calendar
                </Link>
                <span className="text-purple-300 text-sm font-medium">Hello, {user.username}!</span>
                <Link to="/logout" className="text-pink-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-pink transition-all border border-pink-500/30">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-cyan-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30">
                  Login
                </Link>
                <Link to="/register" className="text-purple-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow transition-all border border-purple-500/30">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8 gap-12 relative z-10">
        {user && user.exercises && user.exercises.length > 0 && (
          <div className="w-full max-w-7xl mt-8">
            <div className="glass-effect rounded-3xl p-10 border border-purple-500/30 neon-glow">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-8 text-glow">
                My Exercises
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="glass-effect border-2 border-cyan-500/30 rounded-2xl p-6 hover:-translate-y-1 hover:border-cyan-400 hover:neon-glow-cyan transition-all cursor-pointer"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold text-cyan-200">{exercise.name}</h3>
                      <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full text-sm font-medium w-fit neon-glow">
                        {exercise.group}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {user && (!user.exercises || user.exercises.length === 0) && (
          <div className="w-full max-w-7xl mt-8">
            <div className="glass-effect rounded-3xl p-10 border border-purple-500/30 neon-glow">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-8 text-glow">
                My Exercises
              </h2>
              <p className="text-gray-300 opacity-70 text-lg text-center py-8 m-0 font-light">
                No exercises yet. Start adding your exercises!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home

