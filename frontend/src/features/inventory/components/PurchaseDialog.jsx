import { ShoppingCart, AlertTriangle, PackageCheck } from 'lucide-react'
import Dialog, { DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

/**
 * PurchaseDialog — confirms purchasing 1 unit of a vehicle.
 * Calls POST /api/vehicles/:id/purchase on confirm.
 *
 * @param {boolean}  open
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {boolean}  isLoading
 * @param {object}   vehicle
 */
export default function PurchaseDialog({ open, onClose, onConfirm, isLoading, vehicle }) {
  if (!vehicle) return null

  const isLastUnit = vehicle.quantity === 1

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm Purchase"
      description="Review the details before processing this sale."
      size="sm"
    >
      <div className="flex flex-col gap-4">
        {/* Vehicle summary card */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={20} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {vehicle.make} {vehicle.model}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{vehicle.category}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-slate-800">{formatCurrency(vehicle.price)}</p>
            <p className="text-xs text-slate-400 mt-0.5">per unit</p>
          </div>
        </div>

        {/* Transaction detail */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Units being purchased</span>
            <span className="font-bold text-slate-800">1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Current stock</span>
            <span className="font-bold text-slate-800">{vehicle.quantity}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-blue-200 pt-2">
            <span className="text-slate-600">Stock after purchase</span>
            <span className="font-bold text-blue-700">{vehicle.quantity - 1}</span>
          </div>
        </div>

        {/* Last unit warning */}
        {isLastUnit && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Last unit!</strong> This vehicle will be out of stock after purchase. Consider restocking soon.
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          id="purchase-confirm-btn"
          loading={isLoading}
          onClick={onConfirm}
          className="gap-2"
        >
          <PackageCheck size={15} />
          Confirm Purchase
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
