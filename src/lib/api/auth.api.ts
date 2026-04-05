import { apiClient } from './client'
import type { User } from '@/types'

export type LoginResponse = { user: User; token: string }

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    apiClient<LoginResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => apiClient<User>('/api/auth/me'),
}
