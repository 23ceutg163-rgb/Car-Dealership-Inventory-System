import { Link } from 'react-router-dom'
import { Car, Pencil, Trash2, Eye, PackageX, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'

/** Stock badge config */
function getStockBadge(quantity) {
  if (quantity === 0)  return { variant: 'destructive', label: 'Out of Stock' }
  if (quantity <= 3)   return { variant: 'warning',     label: 'Low Stock' }
  return                      { variant: 'success',      label: 'In Stock' }
}

/** Single skeleton row while loading */
function SkeletonRow() {
  return (
    <tr>
      {[48, 64, 56, 60, 36, 52, 80].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  )
}

/**
 * VehicleTable — full vehicles data table with sort indicators and row actions.
 *
 * @param {object}    props
 * @param {Vehicle[]} props.vehicles
 * @param {boolean}   props.isLoading
 * @param {boolean}   props.isAdmin
 * @param {function}  props.onDelete    - Called with vehicle object → opens confirm dialog
 * @param {string}    props.sortKey     - Currently sorted column key
 * @param {'asc'|'desc'} props.sortDir
 * @param {function}  props.onSort      - Called with column key
 */
export default function VehicleTable({
  vehicles = [],
  isLoading,
  isAdmin,
  onDelete,
  sortKey,
  sortDir,
  onSort,
}) {
  const columns = [
    { key: 'make',      label: 'Vehicle',   sortable: true },
    { key: 'category',  label: 'Category',  sortable: true },
    { key: 'price',     label: 'Price',     sortable: true, align: 'right' },
    { key: 'quantity',  label: 'Stock',     sortable: true, align: 'right' },
    { key: 'status',    label: 'Status',    sortable: false, align: 'center' },
    { key: 'createdAt', label: 'Added',     sortable: true, align: 'right' },
    { key: 'actions',   label: '',          sortable: false, align: 'right' },
  ]

  function SortIcon({ col }) {
    if (!col.sortable) return null
    const active = sortKey === col.key
    return (
      <ArrowUpDown
        size={12}
        className={`inline ml-1 ${active ? 'text-blue-600' : 'text-slate-300'}`}
      />
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Vehicles inventory table">

          {/* Header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap
                    ${col.align === 'right'  ? 'text-right'  : ''}
                    ${col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700 transition-colors' : ''}
                  `}
                  onClick={() => col.sortable && onSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  {col.label}
                  <SortIcon col={col} />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-50">
            {/* Loading skeletons */}
            {isLoading && Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!isLoading && vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                      <PackageX size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">No vehicles found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                    <Link to="/vehicles/add">
                      <Button size="sm" className="mt-1">+ Add Vehicle</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && vehicles.map((vehicle) => {
              const { variant, label } = getStockBadge(vehicle.quantity)
              return (
                <tr
                  key={vehicle._id}
                  className="hover:bg-blue-50/40 transition-colors duration-100 group"
                >
                  {/* Vehicle make + model */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-100">
                        <Car size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{vehicle.make}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{vehicle.model}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {vehicle.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800">
                    {formatCurrency(vehicle.price)}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-sm font-bold ${
                      vehicle.quantity === 0 ? 'text-rose-500' :
                      vehicle.quantity <= 3  ? 'text-amber-600' :
                                               'text-slate-800'
                    }`}>
                      {vehicle.quantity}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant={variant}>{label}</Badge>
                  </td>

                  {/* Date added */}
                  <td className="px-4 py-3.5 text-right text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(vehicle.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {/* View */}
                      <Link to={`/vehicles/${vehicle._id}`}>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View details"
                          aria-label={`View ${vehicle.make} ${vehicle.model}`}
                        >
                          <Eye size={15} />
                        </button>
                      </Link>

                      {/* Edit */}
                      <Link to={`/vehicles/${vehicle._id}/edit`}>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit vehicle"
                          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                        >
                          <Pencil size={15} />
                        </button>
                      </Link>

                      {/* Delete (admin only) */}
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(vehicle)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete vehicle"
                          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
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
