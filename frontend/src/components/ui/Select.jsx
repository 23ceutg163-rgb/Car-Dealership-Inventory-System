import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Select — styled native <select> wrapper.
 * Accepts the same props as a native <select> element.
 *
 * @param {string}  [props.error]     - Error message string; triggers red border
 * @param {string}  [props.className]
 * @param {node}    props.children    - <option> elements
 */
export const Select = forwardRef(function Select(
  { className, error, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        // Base
        'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9 text-sm text-slate-900',
        'font-[inherit] outline-none transition-all duration-150 cursor-pointer',
        // Border / focus
        'border-slate-200',
        'focus:border-blue-400 focus:ring-3 focus:ring-blue-100',
        // Error state
        error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
        // Arrow icon via background (CSS only)
        'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'none\' stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m4 6 4 4 4-4\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})
