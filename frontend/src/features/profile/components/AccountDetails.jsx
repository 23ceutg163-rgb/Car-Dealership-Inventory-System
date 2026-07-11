import { User, Mail, ShieldCheck, Hash, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

/**
 * Single read-only info field row.
 */
function InfoRow({ icon: Icon, label, value, extra }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800 break-all">{value}</p>
          {extra}
        </div>
      </div>
    </div>
  )
}

/**
 * AccountDetails — read-only card showing name, email, role, and user ID.
 *
 * @param {object}  user
 * @param {boolean} isAdmin
 */
export default function AccountDetails({ user, isAdmin }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your profile details on record</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow
          icon={User}
          label="Full Name"
          value={user?.name ?? '—'}
        />
        <InfoRow
          icon={Mail}
          label="Email Address"
          value={user?.email ?? '—'}
        />
        <InfoRow
          icon={ShieldCheck}
          label="Account Role"
          value={isAdmin ? 'Administrator' : 'Staff'}
          extra={
            <Badge variant={isAdmin ? 'admin' : 'secondary'}>
              {isAdmin ? 'Admin' : 'Staff'}
            </Badge>
          }
        />
        <InfoRow
          icon={Hash}
          label="User ID"
          value={user?.id ? `…${user.id.slice(-10)}` : '—'}
        />

        {/* Read-only notice */}
        <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Profile information is managed by your administrator. Contact them to update your details.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
