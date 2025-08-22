import { create } from 'zustand'
import { useUserStore } from './userStore'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  logout: async () => {
    try {
      await import('../utils/axios').then(({ default: api }) => api.get('/auth/logout'))
    } catch {}
    set({ isAuthenticated: false })
  },
  checkAuth: async () => {
    try {
      await useUserStore.getState().fetchUser()
    } catch {
      set({ isAuthenticated: false })
    }
  }
}))