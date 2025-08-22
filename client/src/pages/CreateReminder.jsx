import { useState, useEffect } from 'react'
import { useReminderStore } from '../store/reminderStore'
import { useFriendStore } from '../store/friendStore'
import { useNavigate } from 'react-router-dom'

export default function CreateReminder() {
  const [message, setMessage] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [type, setType] = useState('custom')
  const [friendId, setFriendId] = useState('')
  const { addReminder, loading, error } = useReminderStore()
  const { friends, fetchFriends, loading: friendsLoading } = useFriendStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!friends || friends.length === 0) {
      fetchFriends()
    }
  }, [friends, fetchFriends])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message || !scheduledTime) return
    await addReminder({ message, scheduledTime, type, friendId: friendId || undefined })
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Add Reminder</h1>
        <input className="border p-2 w-full mb-3" placeholder="Reminder message" value={message} onChange={e => setMessage(e.target.value)} />
        <input className="border p-2 w-full mb-3" type="datetime-local" placeholder="Scheduled Time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Type</label>
          <select className="border p-2 w-full" value={type} onChange={e => setType(e.target.value)} required>
            <option value="custom">Custom</option>
            <option value="birthday">Birthday</option>
            <option value="weekly_checkin">Weekly Check-in</option>
            <option value="ritual">Ritual</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Friend (optional)</label>
          <select className="border p-2 w-full" value={friendId} onChange={e => setFriendId(e.target.value)}>
            <option value="">None</option>
            {friendsLoading ? (
              <option>Loading...</option>
            ) : (
              friends && friends.length > 0 &&
              friends.map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.name || friend.email}
                </option>
              ))
            )}
          </select>
        </div>
        <button className="bg-blue-500 text-white w-full py-2 rounded" disabled={loading}>Add</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  )
}
