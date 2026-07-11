import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { loginUser, registerUser } from '../api/authApi'
import { useAuthContext } from '@/context/AuthContext'

/**
 * TanStack mutation hook for logging in.
 * On success → stores token, redirects to /dashboard.
 * On error   → shows a Sonner toast with the server error message.
 */
export function useLoginMutation() {
  const { login } = useAuthContext()
  const navigate  = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data) // { token, user }
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error ?? 'Login failed. Please try again.'
      toast.error(message)
    },
  })
}

/**
 * TanStack mutation hook for registering a new account.
 * On success → stores token, redirects to /dashboard.
 * On error   → shows a Sonner toast with the server error message.
 */
export function useRegisterMutation() {
  const { login } = useAuthContext()
  const navigate  = useNavigate()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data) // { token, user }
      toast.success(`Account created! Welcome, ${data.user.name}!`)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error ?? 'Registration failed. Please try again.'
      toast.error(message)
    },
  })
}
