import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RefreshCcw, ShieldCheck, Package } from 'lucide-react'
import Dialog, { DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Label, FieldError } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

// ── Zod schema ────────────────────────────────────────────────────────────────
const restockSchema = z.object({
  quantity: z.coerce
    .number({ invalid_type_error: 'Please enter a valid number' })
    .int('Must be a whole number')
    .min(1, 'Restock quantity must be at least 1')
    .max(9999, 'Quantity seems too high — please verify'),
})

/**
 * RestockDialog — admin-only modal for adding stock to a vehicle.
 * Calls POST /api/vehicles/:id/restock with { quantity }.
 *
 * @param {boolean}  open
 * @param {function} onClose
 * @param {function} onConfirm  - Called with { quantity: number }
 * @param {boolean}  isLoading
 * @param {object}   vehicle
 */
export default function RestockDialog({ open, onClose, onConfirm, isLoading, vehicle }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restockSchema),
    defaultValues: { quantity: '' },
  })

  const qtyValue = watch('quantity')
  const newStock = vehicle ? (vehicle.quantity + (Number(qtyValue) || 0)) : 0

  function handleClose() {
    reset()
    onClose()
  }

  function onSubmit(data) {
    onConfirm(data.quantity)
  }

  if (!vehicle) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Restock Vehicle"
      size="sm"
    >
      {/* Admin badge */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl">
        <ShieldCheck size={15} className="text-violet-600" />
        <span className="text-xs font-semibold text-violet-700">Admin Operation</span>
      </div>

      {/* Vehicle summary */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <RefreshCcw size={18} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="text-xs text-slate-500">{vehicle.category} · {formatCurrency(vehicle.price)}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-400">Current stock</p>
          <p className={`text-base font-bold ${vehicle.quantity === 0 ? 'text-rose-600' : vehicle.quantity <= 3 ? 'text-amber-600' : 'text-slate-800'}`}>
            {vehicle.quantity}
          </p>
        </div>
      </div>

      {/* Restock form */}
      <form onSubmit={handleSubmit(onSubmit)} id="restock-form" noValidate>
        <Label htmlFor="restock-qty">
          Quantity to add <span className="text-slate-400 font-normal">(units)</span>
        </Label>
        <Input
          id="restock-qty"
          type="number"
          min="1"
          step="1"
          placeholder="Enter quantity…"
          leftIcon={<Package size={15} />}
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <FieldError message={errors.quantity?.message} />

        {/* Preview new stock level */}
        {qtyValue && Number(qtyValue) > 0 && !errors.quantity && (
          <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <span className="text-sm text-slate-600">New stock level</span>
            <span className="text-base font-bold text-emerald-700">{newStock} units</span>
          </div>
        )}
      </form>

      <DialogFooter>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          id="restock-confirm-btn"
          form="restock-form"
          type="submit"
          loading={isLoading}
          className="gap-2"
        >
          <RefreshCcw size={14} />
          Restock
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
