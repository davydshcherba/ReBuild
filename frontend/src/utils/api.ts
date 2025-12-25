const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ApiError {
  detail: {
    message: string;
  };
}

export interface Exercise {
  id: number;
  name: string;
  group: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  exercises: Exercise[];
}

export interface CreateExerciseResponse {
  message: string;
}

export const api = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail.message || 'Login failed');
    }

    return response.json();
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail.message || 'Registration failed');
    }

    return response.json();
  },

  async getMe(): Promise<UserData> {
    const response = await fetch(`${BACKEND_URL}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      const error: ApiError = await response.json();
      throw new Error(error.detail?.message || 'Failed to fetch user data');
    }

    return response.json();
  },

  async createExercise(name: string, group: string): Promise<CreateExerciseResponse> {
    const response = await fetch(`${BACKEND_URL}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, group }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      const error: ApiError = await response.json();
      throw new Error(error.detail?.message || 'Failed to create exercise');
    }

    return response.json();
  },
};

