import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Car,
  Package,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

// ── Navigation Config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    section: 'Main',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/vehicles',  label: 'Vehicles',  icon: Car },
    ],
  },
  {
    section: 'Inventory',
    links: [
      { to: '/inventory', label: 'Inventory', icon: Package },
      { to: '/inventory/restock', label: 'Restock', icon: RefreshCcw, adminOnly: true },
    ],
  },
  {
    section: 'Account',
    links: [
      { to: '/profile', label: 'Profile', icon: User },
    ],
  },
]

// ── Sidebar Component ─────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const sidebarClass = [
    'sidebar',
    collapsed      ? 'collapsed'     : '',
    mobileOpen     ? 'mobile-open'   : '',
  ].join(' ')

  return (
    <aside className={sidebarClass} aria-label="Main navigation">

      {/* ── Header / Logo ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon" aria-hidden="true">
          <Car size={18} color="#ffffff" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">AutoVault</span>

        {/* Collapse toggle — desktop only */}
        <button
          className="sidebar-collapse-btn hidden md:flex"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={16} />
            : <ChevronLeft  size={16} />
          }
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((section) => {
          // Filter admin-only links for non-admin users
          const visibleLinks = section.links.filter(
            (link) => !link.adminOnly || isAdmin
          )
          if (visibleLinks.length === 0) return null

          return (
            <div key={section.section}>
              <p className="sidebar-section-label">{section.section}</p>

              {visibleLinks.map(({ to, label, icon: Icon, adminOnly }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onCloseMobile}
                  title={collapsed ? label : undefined}
                >
                  <span className="sidebar-link-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="sidebar-link-text">{label}</span>
                  {adminOnly && (
                    <span className="sidebar-link-badge">Admin</span>
                  )}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* ── Footer / User card ── */}
      <div className="sidebar-footer">
        {/* Admin shield badge */}
        {isAdmin && !collapsed && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-lg bg-violet-900/30 border border-violet-800/40">
            <ShieldCheck size={13} className="text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">Administrator</span>
          </div>
        )}

        {/* User card */}
        <div className="sidebar-user-card" title={collapsed ? user?.name : undefined}>
          <div className="sidebar-avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </div>

          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name ?? 'User'}</p>
            <p className="sidebar-user-role">{isAdmin ? 'Admin' : 'Staff'}</p>
          </div>

          {/* Logout button */}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="sidebar-collapse-btn ml-auto"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* Logout when collapsed */}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="sidebar-link w-full mt-1 text-red-500 hover:bg-red-900/20"
            aria-label="Log out"
            title="Log out"
          >
            <span className="sidebar-link-icon">
              <LogOut size={16} />
            </span>
          </button>
        )}
      </div>
    </aside>
  )
}
