import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'

/**
 * AppLayout — the authenticated shell wrapping all dashboard pages.
 * Renders a fixed Sidebar + sticky Navbar + scrollable page Outlet.
 * Uses location.key as a React key on the page wrapper to trigger a
 * CSS fade-in animation on every route change.
 */
export default function AppLayout() {
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar      = () => setSidebarCollapsed((prev) => !prev)
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev)
  const closeMobileSidebar  = () => setMobileSidebarOpen(false)

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={toggleSidebar}
        onCloseMobile={closeMobileSidebar}
      />

      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={toggleMobileSidebar}
        />

        {/* key=location.key re-mounts wrapper on route change, triggering page-fade-in */}
        <main className="page-content" key={location.key}>
          <div className="page-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
