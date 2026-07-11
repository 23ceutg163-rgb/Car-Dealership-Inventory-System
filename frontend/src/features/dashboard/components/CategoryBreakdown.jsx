import { useMemo } from 'react'
import { Tag } from 'lucide-react'

/**
 * Groups vehicles by category and computes counts + percentage.
 * @param {Vehicle[]} vehicles
 * @returns {{ category: string, count: number, pct: number }[]}
 */
function buildCategoryStats(vehicles) {
  const counts = vehicles.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] ?? 0) + 1
    return acc
  }, {})

  const total = vehicles.length || 1

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

/** Color palette for category bars — cycles through if more than 8 categories */
const BAR_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-orange-500',
]

/**
 * CategoryBreakdown — sidebar card showing vehicle count per category.
 *
 * @param {object}   props
 * @param {Vehicle[]} props.vehicles
 * @param {boolean}   props.isLoading
 */
export default function CategoryBreakdown({ vehicles = [], isLoading }) {
  const categories = useMemo(() => buildCategoryStats(vehicles), [vehicles])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">By Category</h2>
        <p className="text-xs text-slate-400 mt-0.5">Vehicle distribution</p>
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* Loading skeleton */}
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="skeleton h-3.5 w-20 rounded" />
              <div className="skeleton h-3.5 w-8 rounded" />
            </div>
            <div className="skeleton h-2 w-full rounded-full" />
          </div>
        ))}

        {/* Empty state */}
        {!isLoading && categories.length === 0 && (
          <div className="py-10 flex flex-col items-center gap-2 text-center">
            <Tag size={24} className="text-slate-300" />
            <p className="text-sm text-slate-400">No categories yet</p>
          </div>
        )}

        {/* Category rows */}
        {!isLoading && categories.map(({ category, count, pct }, idx) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">{count}</span>
                <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${category}: ${pct}%`}
              />
            </div>
          </div>
        ))}

        {/* Total footer */}
        {!isLoading && categories.length > 0 && (
          <div className="pt-3 mt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Total models</span>
            <span className="text-sm font-bold text-slate-800">{vehicles.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}
