import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Car, Tag, DollarSign, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label, FieldError } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'

// ── Zod Schema ────────────────────────────────────────────────────────────────
export const vehicleSchema = z.object({
  make: z
    .string()
    .min(1, 'Make is required')
    .max(50, 'Make is too long'),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(60, 'Model is too long'),
  category: z
    .string()
    .min(1, 'Category is required'),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be zero or greater'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity must be zero or greater'),
})

// ── Category options (matches common dealership categories) ────────────────
const CATEGORIES = [
  'Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe',
  'Convertible', 'Van', 'Wagon', 'Electric', 'Hybrid', 'Crossover', 'Other',
]

/**
 * VehicleForm — shared form for Add and Edit vehicle pages.
 *
 * @param {object}   props
 * @param {object}   [props.defaultValues] - Pre-fills fields in edit mode
 * @param {function} props.onSubmit        - Called with validated form data
 * @param {boolean}  props.isLoading       - Shows spinner in submit button
 * @param {string}   [props.submitLabel]   - Label on the submit button
 * @param {function} [props.onCancel]      - Called when Cancel is clicked
 */
export default function VehicleForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Vehicle',
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaultValues ?? {
      make:     '',
      model:    '',
      category: '',
      price:    '',
      quantity: '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Vehicle form"
    >
      {/* Row 1: Make + Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vf-make">Make</Label>
          <Input
            id="vf-make"
            placeholder="e.g. Toyota"
            leftIcon={<Car size={15} />}
            error={errors.make?.message}
            {...register('make')}
          />
          <FieldError message={errors.make?.message} />
        </div>

        <div>
          <Label htmlFor="vf-model">Model</Label>
          <Input
            id="vf-model"
            placeholder="e.g. Camry"
            leftIcon={<Car size={15} />}
            error={errors.model?.message}
            {...register('model')}
          />
          <FieldError message={errors.model?.message} />
        </div>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="vf-category">Category</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            <Tag size={15} />
          </span>
          <Select
            id="vf-category"
            className="pl-9"
            error={errors.category?.message}
            {...register('category')}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
        <FieldError message={errors.category?.message} />
      </div>

      {/* Row 2: Price + Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vf-price">Price (USD)</Label>
          <Input
            id="vf-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            leftIcon={<DollarSign size={15} />}
            error={errors.price?.message}
            {...register('price')}
          />
          <FieldError message={errors.price?.message} />
        </div>

        <div>
          <Label htmlFor="vf-quantity">Quantity in Stock</Label>
          <Input
            id="vf-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            leftIcon={<Package size={15} />}
            error={errors.quantity?.message}
            {...register('quantity')}
          />
          <FieldError message={errors.quantity?.message} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          id="vehicle-form-submit"
          type="submit"
          loading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
