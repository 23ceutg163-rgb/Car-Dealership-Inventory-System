import { useMemo } from 'react'
import { Car, Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { useVehiclesQuery } from '@/features/vehicles/hooks/useVehicles'

/**
 * Single stat row inside the ProfileStats card.
 */
function StatRow({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <p className="text-sm font-bold text-slate-800 text-right">{value}</p>
    </div>
  )
}

/**
 * ProfileStats — live inventory stats pulled from the vehicles API.
 * Gives the user a quick sense of the system they're managing.
 */
export default function ProfileStats() {
  const { data: vehicles = [], isLoading } = useVehiclesQuery()

  const stats = useMemo(() => {
    const totalModels = vehicles.length
    const totalUnits  = vehicles.reduce((s, v) => s + v.quantity, 0)
    const totalValue  = vehicles.reduce((s, v) => s + v.price * v.quantity, 0)
    const outOfStock  = vehicles.filter((v) => v.quantity === 0).length
    const categories  = new Set(vehicles.map((v) => v.category)).size
    return { totalModels, totalUnits, totalValue, outOfStock, categories }
  }, [vehicles])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Live system-wide stats</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="skeleton w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-1">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-3 w-16 rounded" />
                </div>
                <div className="skeleton h-4 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <StatRow
              icon={Car}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
              label="Total Vehicle Models"
              value={stats.totalModels}
            />
            <StatRow
              icon={Package}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
              label="Total Units in Stock"
              sub={`across ${stats.totalModels} models`}
              value={stats.totalUnits}
            />
            <StatRow
              icon={DollarSign}
              iconBg="bg-violet-50"
              iconColor="text-violet-500"
              label="Inventory Value"
              sub="sum of price × quantity"
              value={formatCurrency(stats.totalValue)}
            />
            <StatRow
              icon={AlertTriangle}
              iconBg={stats.outOfStock > 0 ? 'bg-rose-50' : 'bg-slate-50'}
              iconColor={stats.outOfStock > 0 ? 'text-rose-500' : 'text-slate-400'}
              label="Out of Stock"
              sub={stats.outOfStock > 0 ? 'Need restocking' : 'All models available'}
              value={stats.outOfStock}
            />
            <StatRow
              icon={TrendingUp}
              iconBg="bg-amber-50"
              iconColor="text-amber-500"
              label="Vehicle Categories"
              sub="unique types in system"
              value={stats.categories}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
