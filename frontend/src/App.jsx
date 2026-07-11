import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import AppLayout from '@/components/layout/AppLayout'

// Route guards
import ProtectedRoute from '@/components/shared/ProtectedRoute'

// Auth pages
import LoginPage    from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'

// App pages
import DashboardPage from '@/pages/DashboardPage'

/**
 * Root router configuration.
 *
 * Route tree:
 *  /              → redirect to /dashboard
 *  /login         → LoginPage (public)
 *  /register      → RegisterPage (public)
 *  /              → ProtectedRoute (requires auth)
 *    /dashboard   → DashboardPlaceholder (Phase 2)
 *    /vehicles    → VehiclesPage         (Phase 3)
 *    /inventory   → InventoryPage        (Phase 4)
 *    /profile     → ProfilePage          (Phase 5)
 */
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — wrapped in AppLayout shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Phase 3 — Vehicles (placeholder) */}
          <Route path="/vehicles/*" element={<DashboardPage />} />

          {/* Phase 4 — Inventory (placeholder) */}
          <Route path="/inventory/*" element={<DashboardPage />} />

          {/* Phase 5 — Profile (placeholder) */}
          <Route path="/profile" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* 404 fallback → redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
