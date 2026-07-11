import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUpDown, RefreshCcw, PackageX, Car } from 'lucide-react'
import { useVehiclesQuery, useRestockVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import RestockDialog from '../components/RestockDialog'

/** Stock badge config */
function getStock(qty) {
  if (qty === 0) return { variant: 'destructive', label: 'Out of Stock', urgency: 0 }
  if (qty <= 3)  return { variant: 'warning',     label: 'Low Stock',    urgency: 1 }
  return               { variant: 'success',      label: 'In Stock',     urgency: 2 }
}

/** Skeleton row */
function SkeletonRow() {
  return (
    <tr>
      {[48, 60, 52, 50, 40, 65, 72].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  )
}

/**
 * RestockPage — admin-only page for bulk-restocking vehicles.
 * Vehicles are sorted by urgency: out of stock → low stock → in stock.
 */
export default function RestockPage() {
  const { data: vehicles = [], isLoading } = useVehiclesQuery()
  const restockMutation = useRestockVehicleMutation()

  const [restockTarget, setRestockTarget] = useState(null)
  const [sortDir, setSortDir]             = useState('asc') // asc = urgency first

  // Sort by urgency (0 = out of stock, 1 = low, 2 = in stock), then by quantity
  const sorted = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      const ua = getStock(a.quantity).urgency
      const ub = getStock(b.quantity).urgency
      if (ua !== ub) return sortDir === 'asc' ? ua - ub : ub - ua
      return sortDir === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity
    })
  }, [vehicles, sortDir])

  function handleRestockConfirm(quantity) {
    if (!restockTarget) return
    restockMutation.mutate(
      { id: restockTarget._id, quantity },
      { onSuccess: () => setRestockTarget(null) }
    )
  }

  const needsAttention = vehicles.filter((v) => v.quantity <= 3).length

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="page-title mb-0">Restock Management</h1>
            <span className="flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">
              <ShieldCheck size={12} /> Admin Only
            </span>
          </div>
          <p className="page-subtitle">Add stock to vehicles sorted by urgency</p>
        </div>

        {/* Urgency summary badge */}
        {!isLoading && needsAttention > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <RefreshCcw size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              {needsAttention} vehicle{needsAttention > 1 ? 's' : ''} need restocking
            </span>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Vehicles restock table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th
                  className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none transition-colors"
                  onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                  aria-sort={sortDir === 'asc' ? 'ascending' : 'descending'}
                >
                  Stock <ArrowUpDown size={12} className="inline ml-1 text-blue-500" />
                </th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {/* Loading */}
              {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty */}
              {!isLoading && sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <PackageX size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No vehicles in inventory</p>
                      <Link to="/vehicles/add" className="text-xs text-blue-600 hover:underline">
                        + Add your first vehicle
                      </Link>
                    </div>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!isLoading && sorted.map((vehicle) => {
                const { variant, label, urgency } = getStock(vehicle.quantity)
                const isUrgent = urgency < 2

                return (
                  <tr
                    key={vehicle._id}
                    className={`hover:bg-blue-50/30 transition-colors group ${isUrgent ? 'bg-rose-50/20' : ''}`}
                  >
                    {/* Vehicle */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-rose-50' : 'bg-blue-50'}`}>
                          <Car size={16} className={isUrgent ? 'text-rose-400' : 'text-blue-400'} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">{vehicle.make}</p>
                          <p className="text-xs text-slate-400">{vehicle.model}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {vehicle.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 text-right font-semibold text-slate-800">
                      {formatCurrency(vehicle.price)}
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-4 text-right">
                      <span className={`text-base font-black ${
                        vehicle.quantity === 0 ? 'text-rose-600' :
                        vehicle.quantity <= 3  ? 'text-amber-600' :
                                                 'text-slate-800'
                      }`}>
                        {vehicle.quantity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <Badge variant={variant}>{label}</Badge>
                    </td>

                    {/* Restock button */}
                    <td className="px-5 py-4 text-right">
                      <Button
                        id={`restock-table-btn-${vehicle._id}`}
                        size="sm"
                        className="gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                        onClick={() => setRestockTarget(vehicle)}
                      >
                        <RefreshCcw size={13} />
                        Restock
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock dialog */}
      <RestockDialog
        open={!!restockTarget}
        onClose={() => setRestockTarget(null)}
        onConfirm={handleRestockConfirm}
        isLoading={restockMutation.isPending}
        vehicle={restockTarget}
      />
    </div>
  )
}
