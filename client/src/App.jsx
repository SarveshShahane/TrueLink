import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Reminders from './pages/Remainders'
import Profile from './pages/Profile'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import CreateFriend from './pages/CreateFriend'
import CreateReminder from './pages/CreateReminder'
import Friend from './pages/Friend'
import Rituals from './pages/Rituals'
import Prompts from './pages/Prompts'
import './App.css'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function AuthRedirect({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  useEffect(() => {
    checkAuth()
  }, [])
  return (
    <Routes>
      <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create-friend" element={<ProtectedRoute><CreateFriend /></ProtectedRoute>} />
      <Route path="/create-reminder" element={<ProtectedRoute><CreateReminder /></ProtectedRoute>} />
  <Route path="/friend/:id" element={<ProtectedRoute><Friend /></ProtectedRoute>} />
  <Route path="/rituals" element={<ProtectedRoute><Rituals /></ProtectedRoute>} />
  <Route path="/prompts" element={<ProtectedRoute><Prompts /></ProtectedRoute>} />
  <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}