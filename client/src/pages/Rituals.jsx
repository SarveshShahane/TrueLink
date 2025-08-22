import { useEffect, useState } from 'react'
import { useRitualStore } from '../store/ritualStore'
import { useFriendStore } from '../store/friendStore'

const Rituals = () => {
    const { rituals, loading, error, fetchRituals, addRitual } = useRitualStore()
    const { friends, fetchFriends } = useFriendStore()
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ to: '', name: '', description: '', template: '', frequency: 'daily' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchRituals()
        fetchFriends()
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        setSaving(true)
        const selectedFriend = friends.find(f => f._id === form.to)
        const toEmail = selectedFriend ? selectedFriend.email : ''
        await addRitual({ ...form, to: toEmail })
        setShowForm(false)
        setForm({ to: '', name: '', description: '', template: '', frequency: 'daily' })
        setSaving(false)
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Rituals</h1>
            <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Ritual'}
            </button>
            {showForm && (
                <form className="mb-6 space-y-2" onSubmit={handleCreate}>
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={form.to}
                        onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                        required
                    >
                        <option value="">Select Friend</option>
                        {Array.isArray(friends) && friends.map(f => (
                            <option key={f._id} value={f._id}>{f.name} ({f.email})</option>
                        ))}
                    </select>
                    <input className="border rounded px-2 py-1 w-full" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    <textarea className="border rounded px-2 py-1 w-full" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    <input className="border rounded px-2 py-1 w-full" placeholder="Template (optional)" value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))} />
                    <select className="border rounded px-2 py-1 w-full" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </form>
            )}
            {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                <div className="grid gap-4">
                    {rituals.map(r => (
                        <div key={r._id} className="border rounded p-4 bg-white shadow">
                            <div className="font-bold text-lg">{r.name}</div>
                            <div className="text-gray-600 mb-1">{r.description}</div>
                            <div className="text-xs text-gray-500 mb-1">Frequency: {r.frequency}</div>
                            {r.template && <div className="text-xs text-gray-400">Template: {r.template}</div>}
                            <div className="text-xs text-gray-500 mt-1">
                                From: {typeof r.from === 'object' && r.from !== null ? (r.from.name || r.from.email || r.from._id) : r.from}
                                {' | To: '}
                                {typeof r.to === 'object' && r.to !== null ? (r.to.name || r.to.email || r.to._id) : r.to}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default Rituals