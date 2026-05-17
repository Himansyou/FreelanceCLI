import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AUTH_KEY = 'freelance_token'
const USER_ID_KEY = 'freelance_user_id'
const USERNAME_KEY = 'freelance_username'

type AuthContextType = {
  token: string | null
  userId: string | null
  username: string | null
  login: (token: string, userId: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_KEY))
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(USER_ID_KEY))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(USERNAME_KEY))

  const login = useCallback((t: string, uid: string, uname: string) => {
    localStorage.setItem(AUTH_KEY, t)
    localStorage.setItem(USER_ID_KEY, uid)
    localStorage.setItem(USERNAME_KEY, uname)
    setToken(t)
    setUserId(uid)
    setUsername(uname)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setToken(null)
    setUserId(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
