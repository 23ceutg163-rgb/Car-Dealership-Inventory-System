import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, Bell, Menu, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

// ── Route → label mapping for breadcrumbs ────────────────────────────────────
const ROUTE_LABELS = {
  '/dashboard':         'Dashboard',
  '/vehicles':          'Vehicles',
  '/vehicles/add':      'Add Vehicle',
  '/inventory':         'Inventory',
  '/inventory/restock': 'Restock',
  '/profile':           'Profile',
}

export default function Navbar({ onMenuClick }) {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate  = useNavigate()
  const location  = useLocation()

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

  // Build breadcrumb label from current path
  const currentLabel = ROUTE_LABELS[location.pathname] ?? 'Page'

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

      {/* ── Breadcrumb ── */}
      <div className="navbar-breadcrumb flex-1">
        <span className="navbar-breadcrumb-home">AutoVault</span>
        <span className="navbar-breadcrumb-sep">/</span>
        <span className="navbar-breadcrumb-current">{currentLabel}</span>
      </div>

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
