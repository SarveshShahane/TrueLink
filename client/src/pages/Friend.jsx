import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/axios'

const Friend = () => {
  const { id } = useParams()
  const [friend, setFriend] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchFriend() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/friends/${id}`)
        setFriend(data)
      } catch (err) {
        setError('Could not fetch friend info')
      }
      setLoading(false)
    }
    fetchFriend()
  }, [id])

  if (loading) return <div className="flex justify-center items-center min-h-[40vh] text-gray-500">Loading...</div>
  if (error) return <div className="flex justify-center items-center min-h-[40vh] text-red-500">{error}</div>
  if (!friend) return null

  const user = friend.friendUserInfo || {}
  const personal = user.personalDetails || {}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-green-500">
        <h1 className="text-2xl font-extrabold text-green-800 mb-4 text-center">Friend Details</h1>
        <div className="space-y-2 text-gray-700">
          <div><span className="font-semibold">Name:</span> <span className="text-gray-600">{friend.name}</span></div>
          <div><span className="font-semibold">Email:</span> <span className="text-gray-600">{friend.email}</span></div>
          <div><span className="font-semibold">Timezone:</span> <span className="text-gray-600">{friend.timezone}</span></div>
          <div><span className="font-semibold">First Name:</span> <span className="text-gray-600">{user.firstName || 'N/A'}</span></div>
          <div><span className="font-semibold">Last Name:</span> <span className="text-gray-600">{user.lastName || 'N/A'}</span></div>
          <div><span className="font-semibold">User Email:</span> <span className="text-gray-600">{user.email || 'N/A'}</span></div>
          <div><span className="font-semibold">Interests:</span> <span className="text-gray-600">{personal.interests && personal.interests.length ? personal.interests.join(', ') : 'N/A'}</span></div>
          <div><span className="font-semibold">Life Events:</span> <span className="text-gray-600">{personal.lifeEvents && personal.lifeEvents.length ? personal.lifeEvents.join(', ') : 'N/A'}</span></div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Birthday:</span>
            <span className="text-gray-600">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
            {user.dob && (
              <button
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                onClick={async () => {
                  const dobDate = new Date(user.dob)
                  const now = new Date()
                  let nextBirthday = new Date(now.getFullYear() + 1, dobDate.getMonth(), dobDate.getDate())
                  const thisYearBirthday = new Date(now.getFullYear(), dobDate.getMonth(), dobDate.getDate())
                  if (thisYearBirthday > now) nextBirthday = thisYearBirthday
                  try {
                    await api.post('/reminders', {
                      message: `Happy Birthday ${user.firstName || friend.name}!`,
                      scheduledTime: nextBirthday,
                      type: 'birthday',
                      friendId: friend._id
                    })
                    alert('Birthday reminder added for ' + nextBirthday.toLocaleDateString())
                  } catch (err) {
                    alert('Failed to add reminder')
                  }
                }}
              >
                Add Birthday Reminder
              </button>
            )}
          </div>
          <div><span className="font-semibold">Conversation Histories:</span>
            <ul className="ml-4 list-disc text-gray-600">
              {personal.conversationHistories && personal.conversationHistories.length ? personal.conversationHistories.map((ch, idx) => (
                <li key={idx}>
                  With: {ch.with || 'N/A'} | Messages: {ch.messages ? ch.messages.length : 0} | Last Updated: {ch.lastUpdated ? new Date(ch.lastUpdated).toLocaleString() : 'N/A'}
                </li>
              )) : <li>N/A</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friend