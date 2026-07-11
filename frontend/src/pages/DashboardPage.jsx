import { Link } from 'react-router-dom'
import { RefreshCcw, Plus, AlertCircle } from 'lucide-react'
import { useVehiclesQuery } from '@/features/vehicles/hooks/useVehicles'
import { useAuthContext } from '@/context/AuthContext'
import StatsGrid from '@/features/dashboard/components/StatsGrid'
import RecentVehicles from '@/features/dashboard/components/RecentVehicles'
import CategoryBreakdown from '@/features/dashboard/components/CategoryBreakdown'
import LowStockBanner from '@/features/dashboard/components/LowStockBanner'

export default function DashboardPage() {
  const { user, isAdmin } = useAuthContext()
  const { data: vehicles = [], isLoading, isError, refetch, isFetching } = useVehiclesQuery()

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        <DashboardHeader user={user} isAdmin={isAdmin} vehicles={vehicles} isLoading={isLoading} isFetching={isFetching} refetch={refetch} />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-rose-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-slate-800">Failed to load dashboard</p>
            <p className="text-sm text-slate-400 mt-1">Could not connect to the backend. Make sure the server is running.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCcw size={14} /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader user={user} isAdmin={isAdmin} vehicles={vehicles} isLoading={isLoading} isFetching={isFetching} refetch={refetch} />

      {/* Low stock warning banner */}
      <LowStockBanner vehicles={vehicles} />

      {/* KPI Stats */}
      <StatsGrid vehicles={vehicles} isLoading={isLoading} />

      {/* Main content grid: table + category breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        <RecentVehicles vehicles={vehicles} isLoading={isLoading} />
        <CategoryBreakdown vehicles={vehicles} isLoading={isLoading} />
      </div>
    </div>
  )
}

// ── Sub-component: page header ─────────────────────────────────────────────────
function DashboardHeader({ user, isAdmin, vehicles, isLoading, isFetching, refetch }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening'

  return (
    <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Greeting */}
      <div>
        <h1 className="page-title">
          {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="page-subtitle">
          {isLoading
            ? 'Loading your inventory overview…'
            : `You have ${vehicles.length} vehicle model${vehicles.length !== 1 ? 's' : ''} in inventory.`}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          aria-label="Refresh dashboard"
          title="Refresh data"
        >
          <RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>

        {/* Add vehicle */}
        <Link
          to="/vehicles/add"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Vehicle
        </Link>
      </div>
    </div>
  )
}
