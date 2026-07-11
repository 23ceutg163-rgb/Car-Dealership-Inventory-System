import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation, useMatch } from 'react-router-dom'
import { Search, Bell, Menu, LogOut, User, ChevronDown, ChevronRight } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '@/context/AuthContext'
import { vehicleKeys } from '@/features/vehicles/hooks/useVehicles'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

// ── Static route → label map ──────────────────────────────────────────────────
const STATIC_LABELS = {
  '/dashboard':         'Dashboard',
  '/vehicles':          'Vehicles',
  '/vehicles/add':      'Add Vehicle',
  '/inventory':         'Inventory',
  '/inventory/restock': 'Restock',
  '/profile':           'My Profile',
}

/**
 * useBreadcrumbs — builds a [{label, to}] array for the current route.
 * For /vehicles/:id and /vehicles/:id/edit, reads the vehicle name from
 * the TanStack Query cache so no extra API call is needed.
 */
function useBreadcrumbs() {
  const location = useLocation()
  const qc       = useQueryClient()

  // Match dynamic vehicle routes
  const vehicleDetailMatch = useMatch('/vehicles/:id')
  const vehicleEditMatch   = useMatch('/vehicles/:id/edit')

  const id = vehicleDetailMatch?.params?.id ?? vehicleEditMatch?.params?.id

  // Read from cache (no fetch, instant)
  const cached = id ? qc.getQueryData(vehicleKeys.detail(id)) : null
  const vehicleName = cached ? `${cached.make} ${cached.model}` : (id ? 'Vehicle' : null)

  const crumbs = [{ label: 'AutoVault', to: '/dashboard' }]
  const path   = location.pathname

  if (path.startsWith('/vehicles')) {
    crumbs.push({ label: 'Vehicles', to: '/vehicles' })

    if (vehicleEditMatch && vehicleName) {
      crumbs.push({ label: vehicleName, to: `/vehicles/${id}` })
      crumbs.push({ label: 'Edit', to: null })
    } else if (vehicleDetailMatch && vehicleName) {
      crumbs.push({ label: vehicleName, to: null })
    } else if (path === '/vehicles/add') {
      crumbs.push({ label: 'Add Vehicle', to: null })
    }
  } else {
    const label = STATIC_LABELS[path]
    if (label && path !== '/dashboard') {
      crumbs.push({ label, to: null })
    }
  }

  return crumbs
}

export default function Navbar({ onMenuClick }) {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate  = useNavigate()
  const crumbs    = useBreadcrumbs()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  function handleLogout() {
    setDropdownOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">

      {/* ── Mobile hamburger ── */}
      <button
        className="navbar-icon-btn md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* ── Dynamic breadcrumb ── */}
      <nav className="navbar-breadcrumb flex-1" aria-label="Breadcrumb">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1
          return (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
              )}
              {crumb.to && !isLast ? (
                <NavLink
                  to={crumb.to}
                  className="navbar-breadcrumb-home hover:text-slate-700 transition-colors"
                >
                  {crumb.label}
                </NavLink>
              ) : (
                <span className={isLast ? 'navbar-breadcrumb-current' : 'navbar-breadcrumb-home'}>
                  {crumb.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>

      {/* ── Search bar ── */}
      <div className="navbar-search">
        <span className="navbar-search-icon" aria-hidden="true">
          <Search size={15} />
        </span>
        <input
          type="search"
          placeholder="Search vehicles…"
          className="navbar-search-input"
          aria-label="Search vehicles"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              navigate(`/vehicles?q=${encodeURIComponent(e.target.value.trim())}`)
            }
          }}
        />
      </div>

      {/* ── Action buttons ── */}
      <div className="navbar-actions">

        {/* Notification bell */}
        <button
          className="navbar-icon-btn"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell size={16} />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="user-menu-btn"
            className="navbar-avatar-btn"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="navbar-avatar" aria-hidden="true">
              {getInitials(user?.name)}
            </div>
            <span className="navbar-avatar-name hidden sm:block">
              {user?.name ?? 'User'}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              aria-labelledby="user-menu-btn"
            >
              {/* User info header */}
              <div className="dropdown-header">
                <p className="dropdown-header-name">{user?.name}</p>
                <p className="dropdown-header-email">{user?.email}</p>
                {isAdmin && (
                  <Badge variant="admin" className="mt-1.5">
                    Administrator
                  </Badge>
                )}
              </div>

              {/* Menu items */}
              <NavLink
                to="/profile"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={15} />
                My Profile
              </NavLink>

              <div className="dropdown-separator" role="separator" />

              <button
                className="dropdown-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
