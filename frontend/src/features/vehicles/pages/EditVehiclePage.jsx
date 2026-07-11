import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Car, AlertCircle } from 'lucide-react'
import { useVehicleQuery, useUpdateVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import VehicleForm from '../components/VehicleForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

/**
 * EditVehiclePage — pre-fills VehicleForm with the existing vehicle data.
 * Loads the vehicle by :id from the URL param via useVehicleQuery.
 * On success, invalidates cache and navigates to the vehicle's detail page.
 */
export default function EditVehiclePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: vehicle, isLoading, isError } = useVehicleQuery(id)
  const updateMutation = useUpdateVehicleMutation()

  function handleSubmit(data) {
    updateMutation.mutate(
      { id, data },
      { onSuccess: () => navigate(`/vehicles/${id}`) }
    )
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <div className="skeleton h-5 w-32 rounded mb-6" />
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="skeleton h-6 w-48 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <AlertCircle size={26} className="text-rose-500" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Vehicle not found</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Vehicles
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header mb-6">
        <button
          onClick={() => navigate(`/vehicles/${id}`)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3 group"
          aria-label="Go back to vehicle details"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Details
        </button>
        <h1 className="page-title">Edit Vehicle</h1>
        <p className="page-subtitle">
          Editing: <strong className="text-slate-700">{vehicle.make} {vehicle.model}</strong>
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Car size={20} className="text-emerald-600" />
              </div>
              <div>
                <CardTitle>Update Vehicle Details</CardTitle>
                <CardDescription>Changes will reflect immediately in inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VehicleForm
              defaultValues={{
                make:     vehicle.make,
                model:    vehicle.model,
                category: vehicle.category,
                price:    vehicle.price,
                quantity: vehicle.quantity,
              }}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
              submitLabel="Save Changes"
              onCancel={() => navigate(`/vehicles/${id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
