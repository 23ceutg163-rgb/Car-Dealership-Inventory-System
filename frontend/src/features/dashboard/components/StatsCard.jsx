import { cn } from '@/lib/utils'

/**
 * StatsCard — individual KPI card on the dashboard.
 *
 * @param {object}  props
 * @param {string}  props.title       - Card label (e.g. "Total Models")
 * @param {string}  props.value       - Formatted value (e.g. "$1,250,000")
 * @param {string}  props.subtitle    - Optional sub-line (e.g. "vehicles tracked")
 * @param {node}    props.icon        - Lucide icon element
 * @param {'blue'|'green'|'violet'|'rose'} props.color - Accent color theme
 * @param {string}  [props.delta]     - Optional trend text (e.g. "+3 this week")
 * @param {boolean} [props.deltaUp]   - true = green arrow, false = red arrow
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  delta,
  deltaUp,
}) {
  const colorMap = {
    blue:   { wrap: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   border: 'border-blue-100' },
    green:  { wrap: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-100' },
    violet: { wrap: 'bg-violet-50', icon: 'bg-violet-100 text-violet-600', border: 'border-violet-100' },
    rose:   { wrap: 'bg-rose-50',   icon: 'bg-rose-100 text-rose-600',   border: 'border-rose-100' },
    amber:  { wrap: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600',  border: 'border-amber-100' },
  }

  const theme = colorMap[color] ?? colorMap.blue

  return (
    <div className={cn(
      'stat-card group',
      'bg-white border rounded-2xl p-5 flex items-start gap-4',
      'shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.05)]',
      'hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5',
      'transition-all duration-200 cursor-default',
      `border-${color}-100`
    )}>

      {/* Icon */}
      <div className={cn(
        'flex items-center justify-center rounded-xl w-12 h-12 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
        theme.icon
      )}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 mb-1 truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
        {delta && (
          <span className={cn(
            'inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full',
            deltaUp
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'
          )}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
    </div>
  )
}
