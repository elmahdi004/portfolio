import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../lib/api.js'

const Ctx = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .get('/auth/me')
      .then((r) => active && setUser(r.data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* ignore */
    }
    setUser(null)
  }, [])

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}

export function useAdminAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return c
}
