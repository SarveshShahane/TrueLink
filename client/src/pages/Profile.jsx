
import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { TIMEZONES } from '../utils/timezones'

export default function Profile() {
  const { user, fetchUser, updateUser } = useUserStore()
  const [interests, setInterests] = useState([])
  const [lifeEvents, setLifeEvents] = useState([])
  const [conversationHistories, setConversationHistories] = useState([])
  const [edit, setEdit] = useState(false)
  const [interestInput, setInterestInput] = useState('')
  const [lifeEventInput, setLifeEventInput] = useState('')
  const [dob, setDob] = useState('')
  const [saving, setSaving] = useState(false)
  const [timezone, setTimezone] = useState('UTC')
console.log(user)
  useEffect(() => {
    fetchUser()
  }, [])
  useEffect(() => {
    if (user) {
      if (user.personalDetails) {
        setInterests(user.personalDetails.interests || [])
        setLifeEvents(user.personalDetails.lifeEvents || [])
        setConversationHistories(user.personalDetails.conversationHistories || [])
      }
      setDob(user.dob ? user.dob.slice(0, 10) : '') 
      setTimezone(user.timezone || 'UTC')
    }
  }, [user])
console.log(user)
  if (!user) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-lg text-gray-500 animate-pulse">Loading profile...</div>
    </div>
  )

  const handleSave = async () => {
    setSaving(true)
    await updateUser({
      dob,
      timezone,
      personalDetails: {
        interests,
        lifeEvents,
        conversationHistories
      }
    })
    setSaving(false)
    setEdit(false)
    fetchUser()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-blue-500">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 mb-2">
            {user.firstName ? user.firstName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
          </div>
          <h1 className="text-2xl font-extrabold text-blue-800 mb-1">
            {user.firstName || ''} {user.lastName || ''}
          </h1>
          <div className="text-gray-500 text-sm">{user.email}</div>
        </div>
        <div className="space-y-2 text-gray-700 mb-4">
          <div><span className="font-semibold">First Name:</span> <span className="text-gray-600">{user.firstName || 'N/A'}</span></div>
          <div><span className="font-semibold">Last Name:</span> <span className="text-gray-600">{user.lastName || 'N/A'}</span></div>
          <div><span className="font-semibold">Email:</span> <span className="text-gray-600">{user.email || 'N/A'}</span></div>
          <div>
            <span className="font-semibold">Date of Birth:</span>{' '}
            {edit ? (
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            ) : (
              <span className="text-gray-600">{user.dob ? user.dob.slice(0, 10) : 'N/A'}</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Timezone:</span>{' '}
            {edit ? (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            ) : (
              <span className="text-gray-600">{user.timezone || 'UTC'}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Interests:</span>
            {edit && (
              <form onSubmit={e => { e.preventDefault(); if (interestInput) { setInterests([...interests, interestInput]); setInterestInput('') } }} className="flex gap-2">
                <input className="border rounded px-2 py-1 text-sm" value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="Add interest" />
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" type="submit">Add</button>
              </form>
            )}
          </div>
          <ul className="flex flex-wrap gap-2">
            {interests.map((i, idx) => (
              <li key={idx} className="bg-blue-100 px-2 py-1 rounded text-xs flex items-center">
                {i}
                {edit && <button className="ml-1 text-red-500" onClick={() => setInterests(interests.filter((_, j) => j !== idx))}>×</button>}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Life Events:</span>
            {edit && (
              <form onSubmit={e => { e.preventDefault(); if (lifeEventInput) { setLifeEvents([...lifeEvents, lifeEventInput]); setLifeEventInput('') } }} className="flex gap-2">
                <input className="border rounded px-2 py-1 text-sm" value={lifeEventInput} onChange={e => setLifeEventInput(e.target.value)} placeholder="Add event" />
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" type="submit">Add</button>
              </form>
            )}
          </div>
          <ul className="flex flex-wrap gap-2">
            {lifeEvents.map((e, idx) => (
              <li key={idx} className="bg-blue-100 px-2 py-1 rounded text-xs flex items-center">
                {e}
                {edit && <button className="ml-1 text-red-500" onClick={() => setLifeEvents(lifeEvents.filter((_, j) => j !== idx))}>×</button>}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 mt-6">
          {!edit && <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEdit(true)}>Edit</button>}
          {edit && <>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEdit(false)}>Cancel</button>
          </>}
        </div>
      </div>
    </div>
  )
}