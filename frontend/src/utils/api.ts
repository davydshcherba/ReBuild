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

export const api = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Important for cookies
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail.message || 'Login failed');
    }

    return response.json();
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Important for cookies
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail.message || 'Registration failed');
    }

    return response.json();
  },
};

