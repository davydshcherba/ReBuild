const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
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
  }>
}

export interface ExerciseRequest {
  name: string
  group: string
  date: string
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
}

