import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Dialog — accessible modal overlay with smooth animation.
 *
 * @param {object}   props
 * @param {boolean}  props.open          - Controls visibility
 * @param {function} props.onClose       - Called when overlay or × is clicked
 * @param {string}   [props.title]       - Modal heading
 * @param {string}   [props.description] - Muted sub-text below title
 * @param {string}   [props.size]        - 'sm' | 'md' | 'lg' (default 'md')
 * @param {boolean}  [props.hideClose]   - Hide the × button
 * @param {node}     props.children
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  hideClose = false,
  children,
}) {
  const overlayRef = useRef(null)

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size] ?? 'max-w-lg'

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl',
          'animate-[dialogIn_0.18s_ease-out_both]',
          sizeClass
        )}
        style={{ animation: 'dialogIn 0.18s ease-out both' }}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

/**
 * DialogFooter — action button row at the bottom of a dialog body.
 */
export function DialogFooter({ children, className }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100', className)}>
      {children}
    </div>
  )
}
