import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * AppLayout — the authenticated shell wrapping all dashboard pages.
 * Renders a fixed Sidebar + sticky Navbar + scrollable page Outlet.
 * Manages the sidebar collapsed/expanded toggle state.
 */
export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev)
  const closeMobileSidebar = () => setMobileSidebarOpen(false)

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

      <div
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={toggleMobileSidebar}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
