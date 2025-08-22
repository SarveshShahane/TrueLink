import { create } from 'zustand'
import api from '../utils/axios'


export const useRitualStore = create((set) => ({
  rituals: [],
  loading: false,
  error: '',
  fetchRituals: async (filter = {}) => {
    set({ loading: true, error: '' })
    try {
      let url = '/rituals'
      const params = []
      if (filter.from) params.push(`from=${filter.from}`)
      if (filter.to) params.push(`to=${filter.to}`)
      if (params.length) url += '?' + params.join('&')
      const { data } = await api.get(url)
      set({ rituals: data, loading: false })
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to fetch rituals', loading: false })
    }
  },
  addRitual: async ({ to, name, description, template, frequency }) => {
    set({ loading: true, error: '' })
    try {
      const { data } = await api.post('/rituals', { to, name, description, template, frequency })
      set((s) => ({ rituals: [...s.rituals, data], loading: false }))
    } catch (err) {
      set({ error: err?.response?.data?.msg || 'Failed to add ritual', loading: false })
    }
  }
}))



export function getRitualsWithOneDayLeft() {
  const rituals = useRitualStore.getState().rituals
  const now = new Date()
  return rituals.filter(r => {
    let nextDate = null
    if (r.frequency === 'daily') {
      nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    } else if (r.frequency === 'weekly') {
      nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
    } else if (r.frequency === 'monthly') {
      nextDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    }
    const diff = (nextDate - now) / (1000 * 60 * 60 * 24)
    return diff >= 0.9 && diff <= 1.1
  })
}
