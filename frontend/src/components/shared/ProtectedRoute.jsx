import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

/**
 * ProtectedRoute — guards all routes inside the authenticated shell.
 *
 * If the user is NOT authenticated, they are silently redirected to /login.
 * The `replace` prop prevents the login page from being pushed to history,
 * so the back-button doesn't bring them back to a protected page.
 *
 * Usage in router:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     ...
 *   </Route>
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

/**
 * AdminRoute — additionally checks for isAdmin.
 * Redirects non-admin authenticated users to /dashboard.
 */
export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuthContext()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin)         return <Navigate to="/dashboard" replace />

  return <Outlet />
}
