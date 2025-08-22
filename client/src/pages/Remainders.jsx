import { useEffect } from 'react'
import { useReminderStore } from '../store/reminderStore'

export default function Reminders() {
  const { reminders, fetchReminders, deleteReminder, loading, error } = useReminderStore()

  useEffect(() => {
    fetchReminders()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-blue-500">
        <h1 className="text-2xl font-extrabold text-blue-800 mb-6 text-center">Reminders</h1>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {loading && <div className="text-gray-500 mb-2 text-center">Loading...</div>}
        {
          reminders.length == 0 ? (<p>No reminder ser.</p>) : (<ul className="space-y-2 mt-4">
            {Array.isArray(reminders) && reminders.map((r) => (
              <li key={r._id} className="flex justify-between items-center border p-3 rounded-xl bg-blue-50 shadow-sm">
                <span className="font-semibold text-blue-900">{r.message} <span className="text-xs text-blue-600 ml-2">{new Date(r.scheduledTime).toLocaleString()}</span></span>
                <button onClick={() => deleteReminder(r._id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded transition" disabled={loading}>Delete</button>
              </li>
            ))}
          </ul>)
        }
      </div>
    </div>
  )
}