import { useState, useRef } from 'react'
import { useFriendStore } from '../store/friendStore'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'

export default function CreateFriend() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const { addFriend, loading, error } = useFriendStore()
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const debounceRef = useRef()

  const handleSearch = async (val) => {
    setSearching(true)
    setSearchError('')
    try {
      const { data } = await api.get(`/friends/search?email=${encodeURIComponent(val)}`)
      setResults(data)
      if (data.length === 0) setSearchError('No users found')
    } catch {
      setSearchError('Error searching users')
    }
    setSearching(false)
  }

  const handleInput = (e) => {
    const val = e.target.value
    setSearch(val)
    setResults([])
    setSelected(null)
    setSearchError('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length === 0) return
    debounceRef.current = setTimeout(() => handleSearch(val), 300)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selected) return
    await addFriend(selected._id)
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleAdd} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Add Friend</h1>
        <div className="mb-3">
          <input
            className="border p-2 flex-1 rounded w-full"
            placeholder="Search by email"
            value={search}
            onChange={handleInput}
            autoComplete="off"
          />
          {searchError && <div className="text-red-500 text-sm mb-2">{searchError}</div>}
          {results.length > 0 && (
            <ul className="border rounded bg-gray-50 max-h-40 overflow-y-auto">
              {results.map(u => (
                <li key={u._id} className={`p-2 cursor-pointer hover:bg-blue-100 ${selected && selected._id === u._id ? 'bg-blue-200' : ''}`} onClick={() => setSelected(u)}>
                  <div className="font-semibold">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-600">{u.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="bg-green-500 text-white w-full py-2 rounded mt-2" disabled={loading || !selected}>Add</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  )
}
