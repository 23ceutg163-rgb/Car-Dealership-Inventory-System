import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer border-0 font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-blue-600 to-blue-700 text-white',
          'shadow-[0_0_16px_rgba(37,99,235,0.35)]',
          'hover:-translate-y-px hover:shadow-[0_0_24px_rgba(37,99,235,0.50)]',
          'active:translate-y-0',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
        ],
        secondary: [
          'bg-white text-slate-700 border border-slate-200',
          'shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
          'hover:bg-slate-50 hover:border-slate-300',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'shadow-[0_0_16px_rgba(220,38,38,0.25)]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ],
        ghost: [
          'bg-transparent text-slate-600',
          'hover:bg-slate-100 hover:text-slate-900',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ],
        outline: [
          'bg-transparent text-blue-600 border border-blue-300',
          'hover:bg-blue-50',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ],
      },
      size: {
        sm:   'px-3 py-1.5 text-sm h-8',
        md:   'px-4 py-2 text-sm h-9',
        lg:   'px-5 py-2.5 text-base h-11',
        icon: 'w-9 h-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

/**
 * Reusable Button component with multiple variants and sizes.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'destructive'|'ghost'|'outline'} [props.variant]
 * @param {'sm'|'md'|'lg'|'icon'} [props.size]
 * @param {boolean} [props.loading] - Shows spinner and disables button
 * @param {string}  [props.className]
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
