import { Package, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'

/**
 * InventoryStatsBar — 3-chip quick-stat row showing stock health at a glance.
 *
 * @param {Vehicle[]} vehicles
 * @param {boolean}   isLoading
 */
export default function InventoryStatsBar({ vehicles = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-44 rounded-2xl flex-1" />
        ))}
      </div>
    )
  }

  const inStock  = vehicles.filter((v) => v.quantity > 3).length
  const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length
  const outStock = vehicles.filter((v) => v.quantity === 0).length

  const chips = [
    {
      icon:    <CheckCircle size={20} />,
      label:   'In Stock',
      value:   inStock,
      bg:      'bg-emerald-50',
      border:  'border-emerald-100',
      iconCls: 'text-emerald-500',
      valCls:  'text-emerald-700',
    },
    {
      icon:    <AlertTriangle size={20} />,
      label:   'Low Stock',
      value:   lowStock,
      bg:      'bg-amber-50',
      border:  'border-amber-100',
      iconCls: 'text-amber-500',
      valCls:  'text-amber-700',
    },
    {
      icon:    <XCircle size={20} />,
      label:   'Out of Stock',
      value:   outStock,
      bg:      outStock > 0 ? 'bg-rose-50' : 'bg-slate-50',
      border:  outStock > 0 ? 'border-rose-100' : 'border-slate-100',
      iconCls: outStock > 0 ? 'text-rose-500' : 'text-slate-400',
      valCls:  outStock > 0 ? 'text-rose-700'  : 'text-slate-500',
    },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {chips.map((c) => (
        <div
          key={c.label}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border flex-1 min-w-[140px] ${c.bg} ${c.border}`}
        >
          <span className={c.iconCls}>{c.icon}</span>
          <div>
            <p className="text-xs font-medium text-slate-500">{c.label}</p>
            <p className={`text-xl font-black leading-none ${c.valCls}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
