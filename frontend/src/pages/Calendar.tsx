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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
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
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Please log in to view your calendar</h2>
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            ReBuild
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/" className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Home
            </Link>
            <span className="text-gray-400 text-sm">Hello, {user.username}!</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Exercise Calendar</h1>
            <p className="text-gray-400">View your exercises by day</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatMonthYear(currentDate)}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Week Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
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
                      ${isToday(date) ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
                      ${isSelected(date) ? 'bg-purple-100 ring-2 ring-purple-500' : 'hover:bg-gray-100'}
                      ${!isSelected(date) && !isToday(date) ? 'bg-white' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`
                        text-sm font-semibold mb-1
                        ${isToday(date) ? 'text-indigo-600' : isSelected(date) ? 'text-purple-600' : 'text-gray-900'}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasExercises && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {dayExercises.slice(0, 3).map(ex => (
                            <span
                              key={ex.id}
                              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                              title={ex.name}
                            />
                          ))}
                          {dayExercises.length > 3 && (
                            <span className="text-xs text-gray-500">+{dayExercises.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Date Exercises */}
          {selectedDate && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
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
                      className="bg-gray-950 border-2 border-gray-800 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                    >
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xl font-semibold text-white">{exercise.name}</h4>
                        <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium w-fit">
                          {exercise.group}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
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

