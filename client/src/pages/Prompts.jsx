import { useEffect, useState } from 'react'
import { usePromptStore } from '../store/promptStore'

const CATEGORIES = ['all', 'emotional', 'reflective', 'casual']

export default function Prompts() {
  const { prompts, loading, error, fetchPrompts, addPrompt } = usePromptStore()
  const [category, setCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ text: '', category: 'casual' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPrompts(category)
  }, [category])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    await addPrompt(form)
    setShowForm(false)
    setForm({ text: '', category: 'casual' })
    setSaving(false)
  }

  const handleRandom = () => {
    if (prompts.length) {
      const p = prompts[Math.floor(Math.random() * prompts.length)]
      alert(p.text)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Prompts</h1>
      <div className="flex gap-2 mb-4">
        <select className="border rounded px-2 py-1" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleRandom}>Surprise Me</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Prompt'}</button>
      </div>
      {showForm && (
        <form className="mb-6 space-y-2" onSubmit={handleCreate}>
          <textarea className="border rounded px-2 py-1 w-full" placeholder="Prompt text" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required />
          <select className="border rounded px-2 py-1 w-full" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            <option value="emotional">Emotional</option>
            <option value="reflective">Reflective</option>
            <option value="casual">Casual</option>
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="grid gap-4">
          {prompts.map(p => (
            <div key={p._id} className="border rounded p-4 bg-white shadow">
              <div className="font-bold text-lg">{p.text}</div>
              <div className="text-xs text-gray-500">Category: {p.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
