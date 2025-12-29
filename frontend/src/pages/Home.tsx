import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, User } from '../utils/api'

const Home = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', group: '', date: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.getMe()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleToggleComplete = async (exerciseId: number, currentCompleted: boolean) => {
    try {
      await api.updateExercise(exerciseId, !currentCompleted)
      // Refresh user data
      const userData = await api.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to update exercise:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.group.trim() || !formData.date) return

    setSubmitting(true)
    try {
      await api.createExercise({
        name: formData.name,
        group: formData.group,
        date: formData.date
      })
      setFormData({ name: '', group: '', date: '' })
      setShowForm(false)
      // Refresh user data to show new exercise
      const userData = await api.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to create exercise:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
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
                <Link to="/statistics" className="text-purple-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow transition-all border border-purple-500/30">
                  Statistics
                </Link>
                <span className="text-purple-300 text-sm font-medium">Hello, {user.username}!</span>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="text-pink-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-pink transition-all border border-pink-500/30"
                >
                  Add Exercise
                </button>
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
        {user && showForm && (
          <div className="w-full max-w-2xl glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">
              Add New Exercise
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyan-300 mb-2">Exercise Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 rounded-lg glass-effect border border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g., Push-ups"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Muscle Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full p-4 rounded-lg glass-effect border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
                  required
                >
                  <option value="">Select group</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="core">Core</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              <div>
                <label className="block text-pink-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-4 rounded-lg glass-effect border border-pink-500/30 text-white focus:border-pink-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-lg font-semibold neon-glow hover:scale-105 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Exercise'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                    className={`glass-effect border-2 rounded-2xl p-6 hover:-translate-y-1 transition-all cursor-pointer ${
                      exercise.is_completed
                        ? 'border-green-500/50 hover:border-green-400 neon-glow-green'
                        : 'border-cyan-500/30 hover:border-cyan-400 hover:neon-glow-cyan'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className={`text-xl font-semibold ${exercise.is_completed ? 'text-green-200' : 'text-cyan-200'}`}>
                        {exercise.name}
                      </h3>
                      <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full text-sm font-medium w-fit neon-glow">
                        {exercise.group}
                      </span>
                      <p className="text-sm text-gray-300">{new Date(exercise.date).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleToggleComplete(exercise.id, exercise.is_completed)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          exercise.is_completed
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                        }`}
                      >
                        {exercise.is_completed ? '✓ Completed' : 'Mark Complete'}
                      </button>
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

