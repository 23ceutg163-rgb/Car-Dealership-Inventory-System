import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Car } from 'lucide-react'
import { useLoginMutation } from '../hooks/useAuthMutations'

// ── Zod Validation Schema ─────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

// ── Login Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: loginMutate, isPending } = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(data) {
    loginMutate(data)
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">

        {/* ── Logo ── */}
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">
            <Car size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="auth-logo-text">AutoVault</span>
        </div>

        {/* ── Heading ── */}
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Login form">

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Email address
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`auth-input ${errors.email ? 'error' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="auth-error-msg" role="alert">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">
              Password
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`auth-input ${errors.password ? 'error' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="auth-error-msg" role="alert">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* ── Footer link ── */}
        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one for free</Link>
        </p>
      </div>
    </div>
  )
}
