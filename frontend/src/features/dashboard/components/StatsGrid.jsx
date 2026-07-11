import { Car, Package, DollarSign, AlertTriangle } from 'lucide-react'
import StatsCard from './StatsCard'
import { formatCurrency } from '@/lib/utils'

/**
 * Skeleton placeholder for a single stat card while loading.
 */
function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
      <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-24 rounded" />
        <div className="skeleton h-7 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  )
}

/**
 * StatsGrid — renders 4 KPI cards computed from the vehicle list.
 *
 * @param {object}   props
 * @param {Vehicle[]} props.vehicles - Full list of vehicles from API
 * @param {boolean}   props.isLoading
 */
export default function StatsGrid({ vehicles = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // ── Compute dashboard KPIs ─────────────────────────────────────────────────
  const totalModels    = vehicles.length
  const totalUnits     = vehicles.reduce((sum, v) => sum + v.quantity, 0)
  const totalValue     = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0)
  const outOfStock     = vehicles.filter((v) => v.quantity === 0).length
  const lowStock       = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length

  const cards = [
    {
      title:    'Total Models',
      value:    totalModels.toString(),
      subtitle: 'vehicle models tracked',
      icon:     <Car size={22} strokeWidth={1.75} />,
      color:    'blue',
      delta:    totalModels > 0 ? `${totalModels} in system` : undefined,
      deltaUp:  true,
    },
    {
      title:    'Units in Stock',
      value:    totalUnits.toString(),
      subtitle: `across ${totalModels} models`,
      icon:     <Package size={22} strokeWidth={1.75} />,
      color:    'green',
      delta:    lowStock > 0 ? `${lowStock} running low` : 'All stocked',
      deltaUp:  lowStock === 0,
    },
    {
      title:    'Inventory Value',
      value:    formatCurrency(totalValue),
      subtitle: 'total market value',
      icon:     <DollarSign size={22} strokeWidth={1.75} />,
      color:    'violet',
    },
    {
      title:    'Out of Stock',
      value:    outOfStock.toString(),
      subtitle: outOfStock === 0 ? 'All models available' : `${outOfStock} need restocking`,
      icon:     <AlertTriangle size={22} strokeWidth={1.75} />,
      color:    outOfStock > 0 ? 'rose' : 'green',
      delta:    outOfStock > 0 ? 'Needs attention' : 'Fully stocked',
      deltaUp:  outOfStock === 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  )
}
