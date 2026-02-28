import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const restoreSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH)
      if (raw) {
        const data = JSON.parse(raw)
        if (data?.email && data?.role) {
          setUser({ email: data.email })
          setRole(data.role)
          return
        }
      }
    } catch (_) {}
    setUser(null)
    setRole(null)
  }, [])

  useEffect(() => {
    restoreSession()
    setLoading(false)
  }, [restoreSession])

  const login = useCallback((email, password) => {
    const result = apiLogin(email, password)
    if (result.success) {
      const payload = {
        email: result.user.email,
        role: result.user.role,
        token: result.token,
      }
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(payload))
      setUser({ email: result.user.email })
      setRole(result.user.role)
      return { success: true, role: result.user.role }
    }
    return { success: false, message: result.message || 'Invalid credentials' }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH)
    setUser(null)
    setRole(null)
  }, [])

  const value = { user, role, loading, login, logout, isAdmin: role === 'ADMIN', isUser: role === 'USER' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
