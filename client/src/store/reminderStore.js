import { create } from 'zustand'
import api from '../utils/axios'

export const useReminderStore = create((set) => ({
  reminders: [],
  loading: false,
  error: '',
  fetchReminders: async () => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.get('/reminders')
      set({ reminders: data, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to fetch reminders', loading: false })
    }
  },
  addReminder: async ({ message, scheduledTime, type, friendId }) => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.post('/reminders', { message, scheduledTime, type, friendId })
      set((s) => ({ reminders: [...s.reminders, data], loading: false }))
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to add reminder', loading: false })
    }
  },
  deleteReminder: async (id) => {
    set({ loading: true, error: '' })
    try {
      await api.delete(`/reminders/${id}`)
      set((s) => ({ reminders: s.reminders.filter((r) => r._id !== id), loading: false }))
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to delete reminder', loading: false })
    }
  }
}))