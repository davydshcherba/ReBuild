const getBaseUrl = () => {
  const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost'
  
  if (isProduction) {
    return '/api'
  }
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const cleanUrl = baseUrl.replace(/\/$/, '')
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
}

const API_BASE_URL = getBaseUrl()

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  weight: number
  height: number
  age: number
  birthdate?: string
}

export interface User {
  id: number
  username: string
  email: string
  exercises: Array<{
    id: number
    name: string
    group: string
    date: string
    is_completed: boolean
  }>
}

export interface ExerciseRequest {
  name: string
  group: string
  date: string
}

export interface StatsTotal {
  total: number
}

export interface StatsPerDay {
  date: string
  count: number
}

export interface StatsPerGroup {
  group: string
  count: number
}

export const api = {
  async login(data: LoginRequest) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.message || 'Login failed')
    }
    
    return response.json()
  },

  async register(data: RegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.message || 'Registration failed')
    }
    
    return response.json()
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    return response.json()
  },

  async createExercise(data: ExerciseRequest) {
    const response = await fetch(`${API_BASE_URL}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        group: data.group,
        date: data.date,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.message || 'Failed to create exercise')
    }
    
    return response.json()
  },

  async updateExercise(exerciseId: number, isCompleted: boolean) {
    const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ is_completed: isCompleted }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.message || 'Failed to update exercise')
    }
    
    return response.json()
  },

  async getStatsTotal(): Promise<StatsTotal> {
    const response = await fetch(`${API_BASE_URL}/stats/total_exercises`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch total exercises')
    }
    
    return response.json()
  },

  async getStatsPerDay(): Promise<StatsPerDay[]> {
    const response = await fetch(`${API_BASE_URL}/stats/exercises_per_day`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises per day')
    }
    
    return response.json()
  },

  async getStatsPerGroup(): Promise<StatsPerGroup[]> {
    const response = await fetch(`${API_BASE_URL}/stats/exercises_per_group`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises per group')
    }
    
    return response.json()
  },
}

