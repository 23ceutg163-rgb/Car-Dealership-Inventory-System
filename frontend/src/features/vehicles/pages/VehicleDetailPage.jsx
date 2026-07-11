import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Car, Tag, DollarSign, Package,
  Pencil, Trash2, Calendar, AlertCircle, ShoppingCart
} from 'lucide-react'
import { useVehicleQuery, useDeleteVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import { useAuthContext } from '@/context/AuthContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import DeleteDialog from '../components/DeleteDialog'

/** Stock badge for detail page */
function getStockBadge(qty) {
  if (qty === 0) return { variant: 'destructive', label: 'Out of Stock' }
  if (qty <= 3)  return { variant: 'warning',     label: 'Low Stock' }
  return                { variant: 'success',      label: 'In Stock' }
}

/**
 * VehicleDetailPage — rich single vehicle view with all metadata and actions.
 */
export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuthContext()

  const { data: vehicle, isLoading, isError } = useVehicleQuery(id)
  const deleteMutation = useDeleteVehicleMutation()

  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    deleteMutation.mutate(id, {
      onSuccess: () => navigate('/vehicles'),
    })
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <div className="skeleton h-5 w-28 rounded mb-6" />
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="skeleton w-16 h-16 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-6 w-40 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <AlertCircle size={26} className="text-rose-500" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Vehicle not found</p>
        <p className="text-xs text-slate-400">This vehicle may have been deleted.</p>
        <Link to="/vehicles" className="text-sm text-blue-600 hover:underline mt-1">
          ← Back to Vehicles
        </Link>
      </div>
    )
  }

  const { variant, label } = getStockBadge(vehicle.quantity)
  const totalValue = vehicle.price * vehicle.quantity

  // ── Detail metrics ─────────────────────────────────────────────────────────
  const metrics = [
    {
      icon:  <Tag size={18} className="text-violet-500" />,
      bg:    'bg-violet-50',
      label: 'Category',
      value: vehicle.category,
    },
    {
      icon:  <DollarSign size={18} className="text-emerald-500" />,
      bg:    'bg-emerald-50',
      label: 'Unit Price',
      value: formatCurrency(vehicle.price),
    },
    {
      icon:  <Package size={18} className="text-blue-500" />,
      bg:    'bg-blue-50',
      label: 'Units in Stock',
      value: vehicle.quantity,
      extra: <Badge variant={variant} className="ml-2">{label}</Badge>,
    },
    {
      icon:  <DollarSign size={18} className="text-amber-500" />,
      bg:    'bg-amber-50',
      label: 'Total Stock Value',
      value: formatCurrency(totalValue),
    },
    {
      icon:  <Calendar size={18} className="text-slate-400" />,
      bg:    'bg-slate-50',
      label: 'Date Added',
      value: formatDate(vehicle.createdAt),
    },
    {
      icon:  <Calendar size={18} className="text-slate-400" />,
      bg:    'bg-slate-50',
      label: 'Last Updated',
      value: formatDate(vehicle.updatedAt),
    },
  ]

  return (
    <div className="max-w-3xl">
      {/* ── Back nav ── */}
      <button
        onClick={() => navigate('/vehicles')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-5 group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Vehicles
      </button>

      {/* ── Main card ── */}
      <Card>
        <CardContent className="p-0">

          {/* Hero header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Car size={30} className="text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {vehicle.make} <span className="text-slate-500 font-medium">{vehicle.model}</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={variant}>{label}</Badge>
                  <span className="text-xs text-slate-400">ID: {vehicle._id.slice(-8)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Link to={`/vehicles/${id}/edit`}>
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Pencil size={14} /> Edit
                </Button>
              </Link>
              {isAdmin && (
                <Button
                  id="vehicle-detail-delete-btn"
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              )}
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-start gap-3 bg-slate-50/60 border border-slate-100 rounded-xl p-4"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${m.bg}`}>
                  {m.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                  <div className="flex items-center mt-0.5">
                    <p className="text-sm font-bold text-slate-800">{m.value}</p>
                    {m.extra}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inventory actions footer */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Inventory Actions</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage this vehicle&apos;s stock from the Inventory section
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/inventory">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ShoppingCart size={14} /> Purchase
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/inventory/restock">
                    <Button size="sm" className="gap-1.5">
                      <Package size={14} /> Restock
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        vehicle={vehicle}
      />
    </div>
  )
}
