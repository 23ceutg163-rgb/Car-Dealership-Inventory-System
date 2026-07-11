import { ShieldCheck, User } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

/**
 * ProfileHero — gradient banner card with large avatar, name, email, and role.
 *
 * @param {object}  user
 * @param {boolean} isAdmin
 */
export default function ProfileHero({ user, isAdmin }) {
  const initials = getInitials(user?.name ?? '')

  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
      {/* Gradient banner */}
      <div
        className="h-32 w-full"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
        }}
        aria-hidden="true"
      >
        {/* Decorative orbs */}
        <div className="absolute top-2 right-8 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute top-8 right-20 w-16 h-16 rounded-full bg-white/5" />
        <div className="absolute top-4 left-1/2 w-40 h-40 rounded-full bg-white/5 -translate-x-1/2" />
      </div>

      {/* Avatar — overlaps banner */}
      <div className="px-6 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Avatar + name */}
          <div className="flex items-end gap-4 -mt-10">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
              aria-hidden="true"
            >
              {initials || <User size={32} />}
            </div>

            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  {user?.name ?? 'User'}
                </h1>
                <Badge variant={isAdmin ? 'admin' : 'secondary'}>
                  {isAdmin ? (
                    <><ShieldCheck size={11} className="mr-0.5" /> Admin</>
                  ) : 'Staff'}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Role pill */}
          <div className="sm:pb-1">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${
              isAdmin
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {isAdmin
                ? <><ShieldCheck size={15} /> Administrator Account</>
                : <><User size={15} /> Staff Account</>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
