import { cn } from '@/lib/utils'

/**
 * EmptyState — reusable full-section empty state with icon, title, and optional CTA.
 *
 * @param {node}   icon        - Lucide icon element (rendered large)
 * @param {string} title       - Short heading (e.g. "No vehicles found")
 * @param {string} description - Helpful sub-text
 * @param {node}   [action]    - Optional CTA button/link node
 * @param {string} [className] - Extra wrapper classes
 */
export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-20 text-center',
        'bg-white border border-slate-200 rounded-2xl shadow-sm',
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {icon}
      </div>

      {/* Text */}
      <div className="space-y-1 max-w-xs">
        <p className="text-base font-semibold text-slate-700">{title}</p>
        {description && (
          <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Optional CTA */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
