import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

/**
 * LowStockBanner — dismissible warning shown when vehicles have ≤ 3 units.
 * Only renders when there are low-stock vehicles.
 *
 * @param {Vehicle[]} vehicles - Full vehicle list
 */
export default function LowStockBanner({ vehicles = [] }) {
  const [dismissed, setDismissed] = useState(false)

  const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3)

  if (dismissed || lowStock.length === 0) return null

  return (
    <div
      className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 mb-6"
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle size={18} className="text-amber-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">
          {lowStock.length} vehicle{lowStock.length > 1 ? 's' : ''} running low on stock
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          {lowStock.map((v) => `${v.make} ${v.model} (${v.quantity} left)`).join(' · ')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/inventory/restock"
          className="text-xs font-semibold text-amber-800 underline-offset-2 hover:underline flex items-center gap-1"
        >
          Restock <ArrowRight size={12} />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-800 transition-colors"
          aria-label="Dismiss low stock warning"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
