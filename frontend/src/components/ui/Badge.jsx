import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
  {
    variants: {
      variant: {
        default:     'bg-blue-50 text-blue-700 border-blue-200',
        success:     'bg-green-50 text-green-700 border-green-200',
        warning:     'bg-amber-50 text-amber-700 border-amber-200',
        destructive: 'bg-red-50 text-red-700 border-red-200',
        secondary:   'bg-slate-100 text-slate-600 border-slate-200',
        outline:     'bg-transparent text-slate-700 border-slate-300',
        admin:       'bg-violet-50 text-violet-700 border-violet-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/**
 * Badge — small pill label for status, categories, and roles.
 *
 * @param {'default'|'success'|'warning'|'destructive'|'secondary'|'outline'|'admin'} variant
 */
export function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
