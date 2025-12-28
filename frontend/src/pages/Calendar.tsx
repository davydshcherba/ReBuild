import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, User } from '../utils/api'

const Calendar = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDateToLocalString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getExercisesForDate = (date: Date | null) => {
    if (!date || !user) return []
    
    const dateString = formatDateToLocalString(date)
    return user.exercises.filter(ex => ex.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

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
          <h2 className="text-3xl text-cyan-300 mb-4 text-glow-cyan">Please log in to view your calendar</h2>
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200 neon-glow-cyan px-4 py-2 rounded-lg glass-effect border border-cyan-500/30 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)
  const selectedExercises = getExercisesForDate(selectedDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
            <span className="text-purple-300 text-sm font-medium">Hello, {user.username}!</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 text-glow">
              Exercise Calendar
            </h1>
            <p className="text-gray-300 font-light">View your exercises by day</p>
          </div>

          <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30"
              >
                <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {formatMonthYear(currentDate)}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-lg text-sm font-semibold neon-glow hover:scale-105 transition-all pulse-glow"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg glass-effect hover:neon-glow-cyan transition-all border border-cyan-500/30"
              >
                <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-cyan-300 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={index} className="aspect-square"></div>
                }

                const dateString = formatDateToLocalString(date)
                const dayExercises = user.exercises.filter(ex => ex.date === dateString)
                const hasExercises = dayExercises.length > 0

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square rounded-xl p-2 text-left transition-all
                      ${isToday(date) ? 'ring-2 ring-cyan-400 neon-glow-cyan glass-effect' : ''}
                      ${isSelected(date) ? 'glass-effect border-2 border-purple-400 neon-glow' : 'glass-effect border border-purple-500/20'}
                      ${!isSelected(date) && !isToday(date) ? 'hover:border-cyan-500/50 hover:neon-glow-cyan' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`
                        text-sm font-semibold mb-1
                        ${isToday(date) ? 'text-cyan-300' : isSelected(date) ? 'text-purple-300' : 'text-gray-300'}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasExercises && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {dayExercises.slice(0, 3).map(ex => (
                            <span
                              key={ex.id}
                              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                              title={ex.name}
                            />
                          ))}
                          {dayExercises.length > 3 && (
                            <span className="text-xs text-cyan-300">+{dayExercises.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="glass-effect rounded-3xl p-8 border border-purple-500/30 neon-glow">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 text-glow">
                Exercises for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {selectedExercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedExercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className="glass-effect border-2 border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 hover:neon-glow-cyan transition-all cursor-pointer"
                    >
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xl font-semibold text-cyan-200">{exercise.name}</h4>
                        <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full text-sm font-medium w-fit neon-glow">
                          {exercise.group}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8 font-light">
                  No exercises scheduled for this day.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Calendar

