import { cn } from '@/lib/utils'

/**
 * Card — surface container with soft border and shadow.
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader — top section of a card, with optional border bottom.
 */
export function CardHeader({ className, bordered = true, children, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        bordered && 'border-b border-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardTitle — headline inside a CardHeader.
 */
export function CardTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn(
        'text-base font-semibold text-slate-900 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * CardDescription — muted subtitle inside a CardHeader.
 */
export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-slate-500 mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * CardContent — main body area of a card.
 */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * CardFooter — bottom section, typically for actions.
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-100 flex items-center gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
