import { Component } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

/**
 * ErrorBoundary — React class component that catches rendering errors.
 * Shows a user-friendly fallback UI instead of a blank crash screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, send this to an error-tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught rendering error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a3a 100%)',
          padding: '2rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '1.5rem',
            padding: '3rem 2.5rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <AlertTriangle size={36} color="#f87171" />
          </div>

          <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
            An unexpected error occurred in the application. The error has been logged.
          </p>

          {/* Error message (dev only) */}
          {this.state.error?.message && (
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '1.75rem',
                textAlign: 'left',
              }}
            >
              <p style={{ color: '#f87171', fontSize: '0.75rem', fontFamily: 'monospace', margin: 0 }}>
                {this.state.error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '0.625rem',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <RefreshCcw size={15} /> Try Again
            </button>
            <button
              onClick={() => { window.location.href = '/dashboard' }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                border: 'none',
                borderRadius: '0.625rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <Home size={15} /> Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }
}
