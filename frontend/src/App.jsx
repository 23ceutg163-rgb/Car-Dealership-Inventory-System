import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import AppLayout from '@/components/layout/AppLayout'

// Route guards
import ProtectedRoute from '@/components/shared/ProtectedRoute'

// Auth pages
import LoginPage    from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'

// Dashboard
import DashboardPage from '@/pages/DashboardPage'

// Vehicles
import VehiclesPage       from '@/features/vehicles/pages/VehiclesPage'
import AddVehiclePage     from '@/features/vehicles/pages/AddVehiclePage'
import EditVehiclePage    from '@/features/vehicles/pages/EditVehiclePage'
import VehicleDetailPage  from '@/features/vehicles/pages/VehicleDetailPage'

/**
 * Root router configuration.
 *
 * Route tree:
 *  /                    → redirect to /dashboard
 *  /login               → LoginPage (public)
 *  /register            → RegisterPage (public)
 *  / (ProtectedRoute)
 *    /dashboard         → DashboardPage
 *    /vehicles          → VehiclesPage
 *    /vehicles/add      → AddVehiclePage
 *    /vehicles/:id      → VehicleDetailPage
 *    /vehicles/:id/edit → EditVehiclePage
 *    /inventory/*       → placeholder (Phase 4)
 *    /profile           → placeholder (Phase 5)
 */
export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected routes — wrapped in AppLayout shell ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* ── Dashboard ── */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* ── Vehicles ── */}
          <Route path="/vehicles"          element={<VehiclesPage />} />
          <Route path="/vehicles/add"      element={<AddVehiclePage />} />
          <Route path="/vehicles/:id"      element={<VehicleDetailPage />} />
          <Route path="/vehicles/:id/edit" element={<EditVehiclePage />} />

          {/* ── Phase 4 — Inventory placeholder ── */}
          <Route path="/inventory/*" element={<DashboardPage />} />

          {/* ── Phase 5 — Profile placeholder ── */}
          <Route path="/profile" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
