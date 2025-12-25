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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            ReBuild
          </h1>
          <nav className="flex gap-6 items-center">
            {user ? (
              <>
                <Link to="/calendar" className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Calendar
                </Link>
                <span className="text-gray-400 text-sm">Hello, {user.username}!</span>
                <Link to="/logout" className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8 gap-12">
        <div className="max-w-7xl w-full bg-white rounded-3xl p-12 shadow-2xl">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-gray-900">Hola, soy Luis</h2>
            <h3 className="text-3xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent min-h-[2.5rem]">
              {typedText}
              {showCursor && <span className="animate-pulse">|</span>}
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 opacity-80 my-4">
              Soy estudiante de Inteligencia Artificial y desarrollador web. Me apasiona crear, aprender y llevar mis ideas a la realidad a través de la programación y creatividad.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all">
                → Contratar
              </button>
              <button className="px-8 py-3.5 rounded-xl text-base font-semibold bg-transparent text-gray-900 border-2 border-gray-300 hover:bg-gray-950 hover:text-white hover:border-indigo-500 transition-all">
                Descargar CV
              </button>
            </div>
            <div className="flex gap-4 mt-8">
              <a href="#" className="text-gray-700 opacity-70 hover:opacity-100 hover:-translate-y-1 hover:text-indigo-500 transition-all" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-700 opacity-70 hover:opacity-100 hover:-translate-y-1 hover:text-indigo-500 transition-all" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {user && user.exercises && user.exercises.length > 0 && (
          <div className="w-full max-w-7xl mt-8">
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
                My Exercises
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-gray-950 border-2 border-gray-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold text-white">{exercise.name}</h3>
                      <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium w-fit">
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
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-8">
                My Exercises
              </h2>
              <p className="text-gray-700 opacity-70 text-lg text-center py-8 m-0">
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

