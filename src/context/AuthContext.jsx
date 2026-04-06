import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('qma_token'))
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('qma_dark') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('qma_dark', darkMode)
  }, [darkMode])

  // Fetch full profile from backend to hydrate user state
  const fetchProfile = useCallback(async (tok) => {
    if (!tok) { setLoading(false); return }
    try {
      const data = await authAPI.getProfile(tok)
      // Merge any locally-cached oauth data (username / email stored by OAuthCallback)
      const cachedUsername = localStorage.getItem('qma_username')
      const cachedEmail    = localStorage.getItem('qma_email')
      setUser({
        ...data,
        username: data.username || cachedUsername || '',
        email:    data.email    || cachedEmail    || '',
      })
    } catch {
      localStorage.removeItem('qma_token')
      localStorage.removeItem('qma_username')
      localStorage.removeItem('qma_email')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProfile(token) }, [token, fetchProfile])

  const login = useCallback(async (username, password) => {
    const data = await authAPI.login(username, password)
    const tok = data.token
    localStorage.setItem('qma_token', tok)
    localStorage.removeItem('qma_username')
    localStorage.removeItem('qma_email')
    setToken(tok)
    setUser({
      username: data.username || username,
      email:    data.email    || '',
      role:     data.role     || 'USER',
      provider: data.provider || 'local',
      id:       data.id,
      createdAt: data.createdAt,
    })
    return data
  }, [])

  const register = useCallback(async (username, password, email) => {
    const data = await authAPI.register(username, password, email)
    const tok = data.token
    localStorage.setItem('qma_token', tok)
    setToken(tok)
    setUser({
      username: data.username || username,
      email:    data.email    || email || '',
      role:     data.role     || 'USER',
      provider: 'local',
      id:       data.id,
      createdAt: data.createdAt,
    })
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await authAPI.logout(token) } catch { /* ignore */ }
    localStorage.removeItem('qma_token')
    localStorage.removeItem('qma_username')
    localStorage.removeItem('qma_email')
    setToken(null)
    setUser(null)
  }, [token])

  const toggleDark = useCallback(() => setDarkMode(d => !d), [])

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!token && !!user,
      login, register, logout,
      darkMode, toggleDark,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
