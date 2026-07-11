import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Car } from 'lucide-react'
import { useCreateVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import VehicleForm from '../components/VehicleForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

/**
 * AddVehiclePage — form page for creating a new vehicle.
 * On success, TanStack mutation handles toast + cache invalidation.
 * Navigates back to /vehicles list on success.
 */
export default function AddVehiclePage() {
  const navigate = useNavigate()
  const createMutation = useCreateVehicleMutation()

  function handleSubmit(data) {
    createMutation.mutate(data, {
      onSuccess: () => navigate('/vehicles'),
    })
  }

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header mb-6">
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3 group"
          aria-label="Go back to vehicles"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Vehicles
        </button>
        <h1 className="page-title">Add Vehicle</h1>
        <p className="page-subtitle">Fill in the details to add a new vehicle to inventory</p>
      </div>

      {/* ── Form card ── */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Car size={20} className="text-blue-600" />
              </div>
              <div>
                <CardTitle>New Vehicle Details</CardTitle>
                <CardDescription>All fields are required</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VehicleForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
              submitLabel="Add to Inventory"
              onCancel={() => navigate('/vehicles')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
