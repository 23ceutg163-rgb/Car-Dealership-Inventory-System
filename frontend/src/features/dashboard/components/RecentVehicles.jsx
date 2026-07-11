import { Link } from 'react-router-dom'
import { Car, ArrowRight, PackageX } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

/**
 * Returns the stock status badge variant and label for a vehicle.
 * @param {number} quantity
 */
function getStockStatus(quantity) {
  if (quantity === 0) return { variant: 'destructive', label: 'Out of Stock' }
  if (quantity <= 3)  return { variant: 'warning',     label: 'Low Stock' }
  return                     { variant: 'success',      label: 'In Stock' }
}

/** Skeleton row while loading */
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="skeleton h-4 rounded" style={{ width: `${[60, 70, 55, 65, 40, 70][i]}%` }} />
        </td>
      ))}
    </tr>
  )
}

/**
 * RecentVehicles — table showing the most recently added vehicles.
 *
 * @param {object}   props
 * @param {Vehicle[]} props.vehicles
 * @param {boolean}   props.isLoading
 */
export default function RecentVehicles({ vehicles = [], isLoading }) {
  // Show the 8 most recent vehicles (API already sorts newest-first)
  const recent = vehicles.slice(0, 8)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Recent Inventory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Latest vehicles added to the system</p>
        </div>
        <Link
          to="/vehicles"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Recent vehicles">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Added</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {/* Loading skeletons */}
            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!isLoading && recent.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <PackageX size={22} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No vehicles yet</p>
                    <p className="text-xs text-slate-400">Add your first vehicle to get started</p>
                    <Link
                      to="/vehicles/add"
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Add Vehicle
                    </Link>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && recent.map((vehicle) => {
              const { variant, label } = getStockStatus(vehicle.quantity)
              return (
                <tr
                  key={vehicle._id}
                  className="hover:bg-slate-50/70 transition-colors duration-100"
                >
                  {/* Vehicle name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Car size={15} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">
                          {vehicle.make}
                        </p>
                        <p className="text-xs text-slate-400">{vehicle.model}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {vehicle.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800">
                    {formatCurrency(vehicle.price)}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-bold ${vehicle.quantity === 0 ? 'text-rose-500' : vehicle.quantity <= 3 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {vehicle.quantity}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant={variant}>{label}</Badge>
                  </td>

                  {/* Date added */}
                  <td className="px-5 py-3.5 text-right text-xs text-slate-400">
                    {formatDate(vehicle.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
