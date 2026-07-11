import { useState, useMemo } from 'react'
import { Package, PackageX } from 'lucide-react'
import { useVehiclesQuery, usePurchaseVehicleMutation, useRestockVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import { useAuthContext } from '@/context/AuthContext'
import { Select } from '@/components/ui/Select'
import InventoryCard from '../components/InventoryCard'
import InventoryStatsBar from '../components/InventoryStatsBar'
import PurchaseDialog from '../components/PurchaseDialog'
import RestockDialog from '../components/RestockDialog'

/** Skeleton card placeholder */
function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 bg-slate-50 border-b border-slate-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-11 h-11 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-lg" />
          <div className="skeleton h-6 w-24 rounded-lg" />
        </div>
      </div>
      <div className="px-5 py-4 space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-2 w-full rounded-full" />
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="skeleton h-8 flex-1 rounded-lg" />
        <div className="skeleton h-8 flex-1 rounded-lg" />
      </div>
    </div>
  )
}

const FILTER_OPTIONS = [
  { value: 'all',     label: 'All Vehicles' },
  { value: 'instock', label: 'In Stock' },
  { value: 'low',     label: 'Low Stock (≤3)' },
  { value: 'out',     label: 'Out of Stock' },
]

/**
 * InventoryPage — card grid of all vehicles with purchase and restock actions.
 */
export default function InventoryPage() {
  const { isAdmin } = useAuthContext()
  const { data: vehicles = [], isLoading, isError } = useVehiclesQuery()

  const purchaseMutation = usePurchaseVehicleMutation()
  const restockMutation  = useRestockVehicleMutation()

  // ── Dialog state ───────────────────────────────────────────────────────────
  const [purchaseTarget, setPurchaseTarget] = useState(null)
  const [restockTarget,  setRestockTarget]  = useState(null)

  // ── Filter state ───────────────────────────────────────────────────────────
  const [stockFilter, setStockFilter] = useState('all')

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (stockFilter === 'instock') return vehicles.filter((v) => v.quantity > 3)
    if (stockFilter === 'low')     return vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3)
    if (stockFilter === 'out')     return vehicles.filter((v) => v.quantity === 0)
    return vehicles
  }, [vehicles, stockFilter])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handlePurchaseConfirm() {
    if (!purchaseTarget) return
    purchaseMutation.mutate(purchaseTarget._id, {
      onSuccess: () => setPurchaseTarget(null),
    })
  }

  function handleRestockConfirm(quantity) {
    if (!restockTarget) return
    restockMutation.mutate(
      { id: restockTarget._id, quantity },
      { onSuccess: () => setRestockTarget(null) }
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        <PageHeader />
        <div className="mt-6 flex flex-col items-center gap-3 py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
            <PackageX size={26} className="text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load inventory</p>
          <p className="text-xs text-slate-400">Make sure the backend server is running on port 5000.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader />

      {/* Quick stats */}
      <InventoryStatsBar vehicles={vehicles} isLoading={isLoading} />

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-52">
          <Select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Filter by stock status"
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <span className="text-sm text-slate-400">
          Showing <strong className="text-slate-700">{filtered.length}</strong> of{' '}
          <strong className="text-slate-700">{vehicles.length}</strong> vehicles
        </span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Skeleton loading */}
        {isLoading && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center gap-3 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Package size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No vehicles match this filter</p>
            <button
              onClick={() => setStockFilter('all')}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Vehicle cards */}
        {!isLoading && filtered.map((vehicle) => (
          <InventoryCard
            key={vehicle._id}
            vehicle={vehicle}
            isAdmin={isAdmin}
            onPurchase={setPurchaseTarget}
            onRestock={setRestockTarget}
          />
        ))}
      </div>

      {/* Dialogs */}
      <PurchaseDialog
        open={!!purchaseTarget}
        onClose={() => setPurchaseTarget(null)}
        onConfirm={handlePurchaseConfirm}
        isLoading={purchaseMutation.isPending}
        vehicle={purchaseTarget}
      />

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

function PageHeader() {
  return (
    <div className="page-header mb-6">
      <h1 className="page-title">Inventory</h1>
      <p className="page-subtitle">Purchase vehicles or manage stock levels</p>
    </div>
  )
}
