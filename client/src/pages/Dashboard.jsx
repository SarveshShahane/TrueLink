import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReminderStore } from '../store/reminderStore'
import { useFriendStore } from '../store/friendStore'
import { useAuthStore } from '../store/authStore'
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useRitualStore } from '../store/ritualStore';
import { getRitualsWithOneDayLeft } from '../store/ritualStore';
export default function Dashboard() {
  const { reminders, fetchReminders } = useReminderStore()
  const { friends, fetchFriends } = useFriendStore()
  const { fetchRituals } = useRitualStore()
  useEffect(() => { fetchReminders(); fetchFriends(); fetchRituals(); }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800 drop-shadow">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-green-700">Friends</h2>
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(friends) && friends.length > 0 ? friends.map(f => (
                <Link to={`/friend/${f._id}`} key={f._id} className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col hover:shadow-md transition cursor-pointer">
                  <span className="font-semibold text-green-900 text-lg">{f.name}</span>
                </Link>
              )) : <div className="text-gray-400 italic">No friends found.</div>}
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Reminders</h2>
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(reminders) && reminders.length > 0 ? reminders.map(r => (
                <div key={r._id} className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col hover:shadow-md transition">
                  <span className="font-semibold text-blue-900 text-lg">{r.message}</span>
                  <span className="text-xs text-blue-600 mt-1">{new Date(r.scheduledTime).toLocaleString()}</span>
                </div>
              )) : <div className="text-gray-400 italic">No reminders found.</div>}
            </div>
          </div>
        </div>
      </div>
      <DueReminders />
      <FriendNotifications />
      <RitualNotifications />
      <div className="max-w-2xl mx-auto mt-12 mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl shadow text-center">
        <h2 className="text-lg font-bold text-yellow-700 mb-2">How Reminders Work</h2>
        <p className="text-yellow-900 mb-2">
          Reminders are automatically checked every minute by our server. When your scheduled time arrives (and it's a reasonable hour in your timezone), you'll receive a notification at your registered email address.
        </p>
        <p className="text-yellow-800 text-sm">
          <b>Note:</b> Make sure your email is correct in your profile. Reminders set for friends will use their timezone if available.
        </p>
      </div>
    </div>
  )
}

function RitualNotifications() {
  const rituals = getRitualsWithOneDayLeft()
  if (!rituals.length) return null
  return (
    <div className="max-w-2xl mx-auto mt-8 mb-8 p-6 bg-purple-50 border border-purple-200 rounded-2xl shadow text-center">
      <h2 className="text-lg font-bold text-purple-700 mb-2">Rituals Coming Up Tomorrow</h2>
      <ul className="text-purple-900">
        {rituals.map(r => (
          <li key={r._id} className="mb-2">
            <span className="font-semibold">{r.name}</span>
            {r.frequency && <span className="ml-2 text-xs text-purple-600">[{r.frequency}]</span>}
            {r.description && <span className="block text-xs text-purple-700">{r.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}


function DueReminders() {
  const { reminders, fetchReminders } = useReminderStore()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    fetchReminders()
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [fetchReminders])

  const dueReminders = reminders.filter(r => {
    return !r.completed && new Date(r.scheduledTime) <= new Date(now)
  })

  if (!dueReminders.length) return null

  return (
    <div className="max-w-2xl mx-auto mt-8 mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow text-center">
      <h2 className="text-lg font-bold text-red-700 mb-2">Reminders Due Now</h2>
      <ul className="text-red-900">
        {dueReminders.map(r => (
          <li key={r._id} className="mb-2">
            <span className="font-semibold">{r.message}</span>
            {r.type && <span className="ml-2 text-xs text-red-600">[{r.type}]</span>}
            {r.friendName && <span className="ml-2 text-xs text-red-500">for {r.friendName}</span>}
            <span className="block text-xs text-red-700">Scheduled: {new Date(r.scheduledTime).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FriendNotifications() {
  const { reminders } = useReminderStore()
  const { user } = useUserStore()
  const now = Date.now()
  const friendReminders = reminders.filter(r => {
    return r.friendUserId === user?._id && !r.completed && new Date(r.scheduledTime) <= new Date(now)
  })
  if (!friendReminders.length) return null
  return (
    <div className="max-w-2xl mx-auto mt-8 mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow text-center">
      <h2 className="text-lg font-bold text-blue-700 mb-2">Reminders For You</h2>
      <ul className="text-blue-900">
        {friendReminders.map(r => (
          <li key={r._id} className="mb-2">
            <span className="font-semibold">{r.message}</span>
            {r.userName && <span className="ml-2 text-xs text-blue-600">from {r.userName}</span>}
            <span className="block text-xs text-blue-700">Scheduled: {new Date(r.scheduledTime).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }
  return (
    <button
      onClick={handleLogout}
      className="ml-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
    >
      Logout
    </button>
  )
}