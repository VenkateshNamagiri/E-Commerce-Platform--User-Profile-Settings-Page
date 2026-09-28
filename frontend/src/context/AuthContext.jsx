import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, if a token is already saved (e.g. the page was refreshed),
  // ask the backend who it belongs to and restore the session - so the user
  // isn't kicked back to /login just for reloading the page.
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  function storeTokens(data) {
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
  }

  async function login(email, password) {
    const res = await api.post('/login', { email, password })
    storeTokens(res.data)
    setUser(res.data.user)
    return res.data.user
  }

  async function register(name, email, password) {
    const res = await api.post('/register', { name, email, password })
    storeTokens(res.data)
    setUser(res.data.user)
    return res.data.user
  }

  async function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  // Merge changed fields (name, email, avatar_url...) into the logged-in user.
  // Anything reading `user` from this context - the Navbar especially - re-renders
  // immediately, so profile edits show up without a page refresh.
  // useCallback keeps the function's identity stable so it's safe in effect deps.
  const updateUser = useCallback(changes => {
    setUser(prev => (prev ? { ...prev, ...changes } : prev))
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
