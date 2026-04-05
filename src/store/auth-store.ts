import { create } from 'zustand'
import { authApi } from '@/lib/api/auth.api'
import type { User } from '@/types'

const TOKEN_KEY = 'flow_token'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrating: boolean

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrating: true,

  login: async (email, password) => {
    const res = await authApi.login(email, password)
    if (!res.success) return { success: false, error: res.error }
    const { user, token } = res.data
    localStorage.setItem(TOKEN_KEY, token)
    set({ user, token, isAuthenticated: true })
    return { success: true }
  },

  signup: async (name, email, password) => {
    const res = await authApi.signup(name, email, password)
    if (!res.success) return { success: false, error: res.error }
    const { user, token } = res.data
    localStorage.setItem(TOKEN_KEY, token)
    set({ user, token, isAuthenticated: true })
    return { success: true }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },

  hydrate: async () => {
    const saved = localStorage.getItem(TOKEN_KEY)
    if (!saved) {
      set({ isHydrating: false })
      return
    }
    // Optimistically set token so apiClient can attach it
    set({ token: saved })
    const res = await authApi.me()
    if (res.success) {
      set({ user: res.data, isAuthenticated: true, isHydrating: false })
    } else {
      localStorage.removeItem(TOKEN_KEY)
      set({ token: null, isHydrating: false })
    }
  },
}))

// Convenience selector
export const getToken = () => useAuthStore.getState().token
