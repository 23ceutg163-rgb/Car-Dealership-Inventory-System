import api from '@/lib/axios'

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function loginUser(data) {
  const response = await api.post('/api/auth/login', data)
  return response.data
}

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function registerUser(data) {
  const response = await api.post('/api/auth/register', data)
  return response.data
}
