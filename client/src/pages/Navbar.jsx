import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
     <nav className="bg-white/90 shadow flex items-center px-8 py-4 mb-10 rounded-b-xl sticky top-0 z-10 backdrop-blur">
        <span className="font-extrabold text-2xl tracking-tight text-blue-700 mr-8">TrueLink</span>
        <Link to="/dashboard" className="mr-6 text-gray-700 hover:text-blue-600 font-medium transition">Dashboard</Link>
        <Link to="/reminders" className="mr-6 text-gray-700 hover:text-blue-600 font-medium transition">Reminders</Link>
        <Link to="/profile" className="mr-6 text-gray-700 hover:text-blue-600 font-medium transition">Profile</Link>
        <Link to="/create-friend" className="mr-4 text-green-700 hover:text-green-900 font-semibold transition">+ Add Friend</Link>
        <Link to="/create-reminder" className="text-blue-700 hover:text-blue-900 font-semibold transition">+ Add Reminder</Link>
        <LogoutButton />
      </nav>

  )
}

export default Navbar