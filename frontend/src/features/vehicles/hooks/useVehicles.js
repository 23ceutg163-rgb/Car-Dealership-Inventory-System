import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getVehicles,
  getVehicleById,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../api/vehiclesApi'

// ── Query Keys ────────────────────────────────────────────────────────────────
export const vehicleKeys = {
  all:    () => ['vehicles'],
  lists:  () => ['vehicles', 'list'],
  list:   (params) => ['vehicles', 'list', params],
  detail: (id) => ['vehicles', 'detail', id],
  search: (params) => ['vehicles', 'search', params],
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Fetches all vehicles. Used by Dashboard and Vehicles list.
 */
export function useVehiclesQuery() {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn:  getVehicles,
  })
}

/**
 * Fetches a single vehicle by ID.
 * @param {string} id
 */
export function useVehicleQuery(id) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn:  () => getVehicleById(id),
    enabled:  !!id,
  })
}

/**
 * Search vehicles with query params.
 * @param {object} params
 */
export function useSearchVehiclesQuery(params) {
  return useQuery({
    queryKey: vehicleKeys.search(params),
    queryFn:  () => searchVehicles(params),
    enabled:  Object.values(params).some(Boolean),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Create a new vehicle. Invalidates the vehicle list on success.
 */
export function useCreateVehicleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() })
      toast.success('Vehicle added to inventory!')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Failed to add vehicle')
    },
  })
}

/**
 * Update an existing vehicle. Invalidates list + detail on success.
 */
export function useUpdateVehicleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() })
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(updated._id) })
      toast.success('Vehicle updated successfully!')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Failed to update vehicle')
    },
  })
}

/**
 * Delete a vehicle (admin only). Invalidates vehicle list on success.
 */
export function useDeleteVehicleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() })
      toast.success('Vehicle deleted from inventory.')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Failed to delete vehicle')
    },
  })
}

/**
 * Purchase a vehicle (decrement quantity by 1). Invalidates list + detail.
 */
export function usePurchaseVehicleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => purchaseVehicle(id),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() })
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(updated._id) })
      toast.success('Purchase recorded successfully!')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Purchase failed')
    },
  })
}

/**
 * Restock a vehicle (admin only). Invalidates list + detail.
 */
export function useRestockVehicleMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }) => restockVehicle(id, quantity),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() })
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(updated._id) })
      toast.success(`Restocked successfully! New quantity: ${updated.quantity}`)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Restock failed')
    },
  })
}
