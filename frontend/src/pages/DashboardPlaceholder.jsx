import { LayoutDashboard } from 'lucide-react'

/**
 * Dashboard placeholder — replaced in Phase 2 with real statistics.
 */
export default function DashboardPlaceholder() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your dealership inventory</p>
      </div>

      <div className="stub-card">
        <div className="stub-icon">
          <LayoutDashboard size={28} />
        </div>
        <h2 className="stub-title">Dashboard — Coming in Phase 2</h2>
        <p className="stub-desc">
          Statistics cards, inventory overview, and recent activity will be
          built here. Phase 1 is complete — authentication and navigation are
          fully functional.
        </p>
      </div>
    </div>
  )
}
