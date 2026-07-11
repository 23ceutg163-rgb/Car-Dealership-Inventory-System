import { createContext, useContext, useState, useCallback } from 'react'

// ── Context Definition ────────────────────────────────────────────────────────
const AuthContext = createContext(null)

/**
 * Reads persisted auth state from localStorage on initialization.
 * Returns { user, token } or { user: null, token: null } if nothing is stored.
 */
function readPersistedAuth() {
  try {
    const token = localStorage.getItem('token')
    const raw   = localStorage.getItem('user')
    const user  = raw ? JSON.parse(raw) : null
    if (token && user) return { token, user }
  } catch {
    // Corrupted localStorage — clear and start fresh
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  return { token: null, user: null }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readPersistedAuth)

  /**
   * Called after a successful login or register API call.
   * Persists token + user to localStorage and updates context state.
   * @param {{ token: string, user: object }} payload
   */
  const login = useCallback(({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  /**
   * Clears all auth state from memory and localStorage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth({ token: null, user: null })
  }, [])

  const value = {
    user:            auth.user,
    token:           auth.token,
    isAuthenticated: !!auth.token && !!auth.user,
    isAdmin:         auth.user?.isAdmin ?? false,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
/**
 * Returns auth context. Must be used inside <AuthProvider>.
 * Throws if called outside the provider (catches misuse early).
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within <AuthProvider>')
  }
  return ctx
}
