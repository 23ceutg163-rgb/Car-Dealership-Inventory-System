import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Car } from 'lucide-react'

/**
 * NotFoundPage — premium 404 page shown for any unknown route.
 */
export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1a3a 100%)',
      }}
    >
      <div className="max-w-lg w-full text-center">

        {/* Animated car icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.30)',
              boxShadow: '0 0 40px rgba(37, 99, 235, 0.15)',
            }}
          >
            <Car size={48} color="#60a5fa" strokeWidth={1.5} />
          </div>
        </div>

        {/* 404 number */}
        <h1
          className="font-black tracking-tighter mb-2 leading-none"
          style={{
            fontSize: 'clamp(5rem, 20vw, 8rem)',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        {/* Headline */}
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: '#f1f5f9' }}
        >
          Road Not Found
        </h2>

        {/* Description */}
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: '#94a3b8' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Road decoration */}
        <div
          className="relative mx-auto mb-8 rounded-full overflow-hidden"
          style={{
            width: '80%',
            height: '4px',
            background: 'rgba(255,255,255,0.08)',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)',
              animation: 'slideAcross 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Home size={16} />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
            }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Animation style injected inline */}
        <style>{`
          @keyframes slideAcross {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
      </div>
    </div>
  )
}
