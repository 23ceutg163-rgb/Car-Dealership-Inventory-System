import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Reusable Input component.
 * Supports left icon slot, error state, and full-width layout.
 *
 * @param {object}      props
 * @param {React.node}  [props.leftIcon]  - Icon rendered inside the left edge
 * @param {string}      [props.error]     - Error message string; triggers red border
 * @param {string}      [props.className]
 */
export const Input = forwardRef(function Input(
  { className, leftIcon, rightIcon, error, ...props },
  ref
) {
  return (
    <div className="relative w-full">
      {/* Left icon */}
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {leftIcon}
        </span>
      )}

      <input
        ref={ref}
        className={cn(
          // Base
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
          'font-[inherit] outline-none transition-all duration-150',
          'placeholder:text-slate-400',
          // Border / focus
          'border-slate-200',
          'focus:border-blue-400 focus:ring-3 focus:ring-blue-100',
          // Error state
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          // Padding adjustment for icons
          leftIcon  && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        {...props}
      />

      {/* Right icon */}
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {rightIcon}
        </span>
      )}
    </div>
  )
})
