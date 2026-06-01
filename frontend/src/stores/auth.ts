import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  _hasHydrated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  fetchMe: () => Promise<void>
  setHasHydrated: (val: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

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
        } catch (err: unknown) {
          const status = (err as { response?: { status?: number } })?.response?.status
          if (status === 401) {
            set({ user: null, token: null })
          }
        }
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ token: s.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
