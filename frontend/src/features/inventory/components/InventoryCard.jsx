import { Car, ShoppingCart, RefreshCcw } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

/** Stock status config */
function getStock(qty) {
  if (qty === 0) return { variant: 'destructive', label: 'Out of Stock', bar: 'bg-rose-500',   text: 'text-rose-600',   ring: 'ring-rose-100', card: 'border-rose-100' }
  if (qty <= 3)  return { variant: 'warning',     label: 'Low Stock',    bar: 'bg-amber-500',  text: 'text-amber-600',  ring: 'ring-amber-100', card: 'border-amber-100' }
  return               { variant: 'success',      label: 'In Stock',     bar: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-50', card: 'border-slate-200' }
}

/**
 * InventoryCard — premium vehicle card with stock indicator and action buttons.
 *
 * @param {object}   props
 * @param {object}   props.vehicle
 * @param {boolean}  props.isAdmin
 * @param {function} props.onPurchase   - Opens PurchaseDialog
 * @param {function} props.onRestock    - Opens RestockDialog (admin only)
 */
export default function InventoryCard({ vehicle, isAdmin, onPurchase, onRestock }) {
  const stock = getStock(vehicle.quantity)
  const isOutOfStock = vehicle.quantity === 0
  // Stock bar width capped at 100, based on a "full" threshold of 20 units
  const barPct = Math.min((vehicle.quantity / 20) * 100, 100)

  return (
    <div
      className={cn(
        'bg-white border rounded-2xl shadow-sm overflow-hidden',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        'flex flex-col',
        stock.card
      )}
    >
      {/* Card header gradient */}
      <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
              <Car size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {vehicle.make}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{vehicle.model}</p>
            </div>
          </div>

          {/* Status badge */}
          <Badge variant={stock.variant} className="flex-shrink-0">
            {stock.label}
          </Badge>
        </div>

        {/* Category + price chips */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded-lg font-medium">
            {vehicle.category}
          </span>
          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-100 px-2 py-1 rounded-lg">
            {formatCurrency(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Stock indicator */}
      <div className="px-5 py-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Stock level</span>
          <span className={cn('text-lg font-black leading-none', stock.text)}>
            {vehicle.quantity}
            <span className="text-xs font-medium text-slate-400 ml-1">units</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', stock.bar)}
            style={{ width: isOutOfStock ? '100%' : `${Math.max(barPct, 4)}%` }}
            role="progressbar"
            aria-valuenow={vehicle.quantity}
            aria-valuemin={0}
            aria-valuemax={20}
            aria-label={`Stock level: ${vehicle.quantity} units`}
          />
        </div>
        {isOutOfStock && (
          <p className="text-xs text-rose-500 font-medium mt-1.5">
            Needs immediate restocking
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 flex gap-2">
        {/* Purchase */}
        <Button
          id={`purchase-btn-${vehicle._id}`}
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => onPurchase(vehicle)}
          disabled={isOutOfStock}
          title={isOutOfStock ? 'Out of stock' : 'Record a purchase'}
        >
          <ShoppingCart size={13} />
          Purchase
        </Button>

        {/* Restock (admin only) */}
        {isAdmin && (
          <Button
            id={`restock-btn-${vehicle._id}`}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onRestock(vehicle)}
            title="Add stock"
          >
            <RefreshCcw size={13} />
            Restock
          </Button>
        )}
      </div>
    </div>
  )
}
