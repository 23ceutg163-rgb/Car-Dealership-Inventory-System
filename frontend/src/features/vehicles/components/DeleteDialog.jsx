import { Trash2, AlertTriangle } from 'lucide-react'
import Dialog, { DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

/**
 * DeleteDialog — confirmation modal before permanently deleting a vehicle.
 * Admin-only: the delete API requires adminOnly middleware.
 *
 * @param {object}   props
 * @param {boolean}  props.open       - Controls modal visibility
 * @param {function} props.onClose    - Called to close without deleting
 * @param {function} props.onConfirm  - Called to confirm deletion
 * @param {boolean}  props.isLoading  - Shows spinner while API call is in-flight
 * @param {object}   [props.vehicle]  - The vehicle being deleted (for display)
 */
export default function DeleteDialog({ open, onClose, onConfirm, isLoading, vehicle }) {
  if (!vehicle) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete Vehicle"
      description="This action is permanent and cannot be undone."
      size="sm"
    >
      {/* Warning icon + message */}
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <Trash2 size={26} className="text-rose-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Delete &ldquo;{vehicle.make} {vehicle.model}&rdquo;?
          </p>
          <p className="text-sm text-slate-500 mt-1">
            This will permanently remove the vehicle and all its data from the inventory.
          </p>
        </div>

        {/* Warning note */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-left w-full">
          <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>{vehicle.quantity} unit{vehicle.quantity !== 1 ? 's' : ''}</strong> in stock will be removed from inventory.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <DialogFooter>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          id="delete-confirm-btn"
          variant="destructive"
          loading={isLoading}
          onClick={onConfirm}
        >
          Delete Vehicle
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
