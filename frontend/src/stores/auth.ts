import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setToken: (token) => {
        localStorage.setItem('token', token)
        set({ token })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get<User>('/auth/me')
          set({ user: data })
        } catch {
          // token expired
        }
      },
    }),
    { name: 'auth', partialize: (s) => ({ token: s.token }) }
  )
)
