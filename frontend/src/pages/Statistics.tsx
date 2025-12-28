import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, User, StatsTotal, StatsPerDay, StatsPerGroup } from '../utils/api'

const Statistics = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalExercises, setTotalExercises] = useState<StatsTotal | null>(null)
  const [exercisesPerDay, setExercisesPerDay] = useState<StatsPerDay[]>([])
  const [exercisesPerGroup, setExercisesPerGroup] = useState<StatsPerGroup[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await api.getMe()
        setUser(userData)

        const [total, perDay, perGroup] = await Promise.all([
          api.getStatsTotal(),
          api.getStatsPerDay(),
          api.getStatsPerGroup()
        ])

        setTotalExercises(total)
        setExercisesPerDay(perDay)
        setExercisesPerGroup(perGroup)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-cyan-300 text-2xl text-glow-cyan">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="text-center relative z-10">
          <h2 className="text-3xl text-cyan-300 mb-4 text-glow-cyan">Please log in to view statistics</h2>
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200 neon-glow-cyan px-4 py-2 rounded-lg glass-effect border border-cyan-500/30 inline-block">
            Go to Login
          </Link>
        </div>
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
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-glow">
            ReBuild
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/" className="text-cyan-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30">
              Home
            </Link>
            <Link to="/calendar" className="text-cyan-300 px-4 py-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30">
              Calendar
            </Link>
            <span className="text-purple-300 text-sm font-medium">Hello, {user.username}!</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 text-glow">
              Statistics
            </h1>
            <p className="text-gray-300 font-light">Your fitness progress overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
                Total Exercises
              </h3>
              <p className="text-4xl font-bold text-cyan-300">{totalExercises?.total || 0}</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                Active Days
              </h3>
              <p className="text-4xl font-bold text-purple-300">{exercisesPerDay.length}</p>
            </div>

            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent mb-4">
                Exercise Groups
              </h3>
              <p className="text-4xl font-bold text-pink-300">{exercisesPerGroup.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 text-glow">
                Exercises per Day (Last 30 Days)
              </h3>
              {exercisesPerDay.length > 0 ? (
                <div className="space-y-4">
                  {exercisesPerDay.slice(-10).map((item) => (
                    <div key={item.date} className="flex justify-between items-center">
                      <span className="text-gray-300">{new Date(item.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-purple-500/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full"
                            style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-cyan-300 font-semibold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8">No data available</p>
              )}
            </div>

            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 text-glow">
                Exercises by Group
              </h3>
              {exercisesPerGroup.length > 0 ? (
                <div className="space-y-4">
                  {exercisesPerGroup.map((item) => (
                    <div key={item.group} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{item.group}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-pink-500/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${Math.min((item.count / Math.max(...exercisesPerGroup.map(g => g.count))) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-purple-300 font-semibold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Statistics