import axios from 'axios'

/**
 * Axios instance pre-configured with the backend base URL.
 * Automatically attaches the JWT token from localStorage to every request.
 * On 401 responses, clears auth state and redirects to /login.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: Attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: Handle 401 Unauthorized ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth state
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
