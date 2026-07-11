import { useNavigate, Link } from 'react-router-dom'
import {
  LogOut, ShieldCheck, Clock, Car, Package,
  LayoutDashboard, RefreshCcw, KeyRound,
} from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import ProfileHero     from '@/features/profile/components/ProfileHero'
import AccountDetails  from '@/features/profile/components/AccountDetails'
import ProfileStats    from '@/features/profile/components/ProfileStats'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

/**
 * ProfilePage — user profile assembled from all profile section components.
 */
export default function ProfilePage() {
  const { user, isAdmin, logout } = useAuthContext()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // Time-based greeting
  const hour = new Date().getHours()
  const timeLabel =
    hour < 12 ? 'Morning' :
    hour < 17 ? 'Afternoon' :
                'Evening'

  return (
    <div className="max-w-5xl">

      {/* ── Page heading ── */}
      <div className="page-header mb-5">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Good {timeLabel}, <strong className="text-slate-700">{user?.name?.split(' ')[0] ?? 'User'}</strong>
          {' '}— here&apos;s your account overview.
        </p>
      </div>

      {/* ── Hero card ── */}
      <ProfileHero user={user} isAdmin={isAdmin} />

      {/* ── Two-column grid: account info + stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <AccountDetails user={user} isAdmin={isAdmin} />
        <ProfileStats />
      </div>

      {/* ── Quick links ── */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump to key sections of the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickLink to="/dashboard"   icon={<LayoutDashboard size={20} />} label="Dashboard"  color="blue" />
            <QuickLink to="/vehicles"    icon={<Car size={20} />}             label="Vehicles"   color="violet" />
            <QuickLink to="/inventory"   icon={<Package size={20} />}         label="Inventory"  color="emerald" />
            {isAdmin && (
              <QuickLink to="/inventory/restock" icon={<RefreshCcw size={20} />} label="Restock" color="amber" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Session & Security card ── */}
      <Card className="border-rose-100">
        <CardHeader>
          <CardTitle>Session & Security</CardTitle>
          <CardDescription>Manage your current login session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session info row */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Active Session</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Signed in as <strong>{user?.email}</strong> ·{' '}
                JWT expires in 7 days
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" aria-label="Session active" />
          </div>

          {/* Token type row */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <KeyRound size={18} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Bearer token stored locally · Role:{' '}
                <span className={`font-semibold ${isAdmin ? 'text-violet-600' : 'text-blue-600'}`}>
                  {isAdmin ? 'Administrator' : 'Staff'}
                </span>
              </p>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full flex-shrink-0">
                <ShieldCheck size={12} /> Admin
              </div>
            )}
          </div>

          {/* Logout button */}
          <div className="flex justify-end pt-1">
            <Button
              id="profile-logout-btn"
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={15} />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── QuickLink sub-component ───────────────────────────────────────────────────
const colorMap = {
  blue:    { bg: 'bg-blue-50   hover:bg-blue-100',   icon: 'text-blue-500',   text: 'text-blue-700',   border: 'border-blue-100' },
  violet:  { bg: 'bg-violet-50 hover:bg-violet-100', icon: 'text-violet-500', text: 'text-violet-700', border: 'border-violet-100' },
  emerald: { bg: 'bg-emerald-50 hover:bg-emerald-100', icon: 'text-emerald-500', text: 'text-emerald-700', border: 'border-emerald-100' },
  amber:   { bg: 'bg-amber-50  hover:bg-amber-100',  icon: 'text-amber-500',  text: 'text-amber-700',  border: 'border-amber-100' },
}

function QuickLink({ to, icon, label, color = 'blue' }) {
  const c = colorMap[color]
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${c.bg} ${c.border}`}
    >
      <span className={c.icon}>{icon}</span>
      <span className={`text-xs font-semibold ${c.text}`}>{label}</span>
    </Link>
  )
}
