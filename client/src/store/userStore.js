import { create } from 'zustand'
import api from '../utils/axios'
import { useAuthStore } from './authStore'

export const useUserStore = create((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data })
      useAuthStore.getState().setAuthenticated(true)
    } catch {
      set({ user: null })
      useAuthStore.getState().setAuthenticated(false)
    }
  },
  updateUser: async (update) => {
    try {
      const { data } = await api.put('/auth/me', update)
      set({ user: data })
    } catch (err) {
    }
  }
}))