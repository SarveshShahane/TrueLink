import { create } from 'zustand'
import api from '../utils/axios'

export const useFriendStore = create((set) => ({
  friends: [],
  loading: false,
  error: '',
  fetchFriends: async () => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.get('/friends')
      set({ friends: data, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to fetch friends', loading: false })
    }
  },
  addFriend: async (friendUserId) => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.post('/friends', { friendUserId })
      set((s) => ({ friends: [...s.friends, data], loading: false }))
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to add friend', loading: false })
    }
  }
}))