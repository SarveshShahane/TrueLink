import { create } from 'zustand'
import api from '../utils/axios'

export const usePromptStore = create((set) => ({
  prompts: [],
  loading: false,
  error: '',
  fetchPrompts: async (category = 'all') => {
    set({ loading: true, error: '' })
    try {
      const url = category && category !== 'all' ? `/prompts?category=${category}` : '/prompts'
      const { data } = await api.get(url)
      set({ prompts: data, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to fetch prompts', loading: false })
    }
  },
  addPrompt: async (prompt) => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.post('/prompts', prompt)
      set((s) => ({ prompts: [...s.prompts, data], loading: false }))
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to add prompt', loading: false })
    }
  }
}))
