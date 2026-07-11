import { cn } from '@/lib/utils'

/**
 * Accessible Label component.
 * Always pair with an input via htmlFor or wrapping.
 */
export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-slate-700 mb-1.5',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

/**
 * Small error message displayed below a form field.
 */
export function FieldError({ message, className }) {
  if (!message) return null
  return (
    <p className={cn('mt-1.5 text-xs text-red-500 font-medium', className)}>
      {message}
    </p>
  )
}
