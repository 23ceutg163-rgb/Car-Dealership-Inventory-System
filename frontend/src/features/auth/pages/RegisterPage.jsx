import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, Eye, EyeOff, Car } from 'lucide-react'
import { useRegisterMutation } from '../hooks/useAuthMutations'

// ── Zod Validation Schema ─────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name is too long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ── Register Page ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [showPassword, setShowPassword]     = useState(false)
  const [showConfirm,  setShowConfirm]      = useState(false)
  const { mutate: registerMutate, isPending } = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  function onSubmit({ name, email, password }) {
    // Only send fields the backend expects — omit confirmPassword
    registerMutate({ name, email, password })
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join AutoVault and manage your inventory</p>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Register form">

          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">Full name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <User size={16} />
              </span>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={`auth-input ${errors.name ? 'error' : ''}`}
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="auth-error-msg" role="alert">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                id="reg-email"
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
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Lock size={16} />
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Confirm password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Lock size={16} />
              </span>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="auth-error-msg" role="alert">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* ── Footer link ── */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in instead</Link>
        </p>
      </div>
    </div>
  )
}
