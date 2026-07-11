import api from '@/lib/axios'

/**
 * GET /api/vehicles
 * Returns all vehicles sorted newest-first (backend default).
 * @returns {Promise<Vehicle[]>}
 */
export async function getVehicles() {
  const response = await api.get('/api/vehicles')
  return response.data
}

/**
 * GET /api/vehicles/:id
 * @param {string} id
 * @returns {Promise<Vehicle>}
 */
export async function getVehicleById(id) {
  const response = await api.get(`/api/vehicles/${id}`)
  return response.data
}

/**
 * GET /api/vehicles/search
 * @param {object} params - { make, model, category, minPrice, maxPrice }
 * @returns {Promise<Vehicle[]>}
 */
export async function searchVehicles(params) {
  const response = await api.get('/api/vehicles/search', { params })
  return response.data
}

/**
 * POST /api/vehicles
 * @param {{ make, model, category, price, quantity }} data
 * @returns {Promise<Vehicle>}
 */
export async function createVehicle(data) {
  const response = await api.post('/api/vehicles', data)
  return response.data
}

/**
 * PUT /api/vehicles/:id
 * @param {string} id
 * @param {Partial<Vehicle>} data
 * @returns {Promise<Vehicle>}
 */
export async function updateVehicle(id, data) {
  const response = await api.put(`/api/vehicles/${id}`, data)
  return response.data
}

/**
 * DELETE /api/vehicles/:id  (admin only)
 * @param {string} id
 * @returns {Promise<{ message: string, id: string }>}
 */
export async function deleteVehicle(id) {
  const response = await api.delete(`/api/vehicles/${id}`)
  return response.data
}

/**
 * POST /api/vehicles/:id/purchase
 * @param {string} id
 * @returns {Promise<Vehicle>}
 */
export async function purchaseVehicle(id) {
  const response = await api.post(`/api/vehicles/${id}/purchase`)
  return response.data
}

/**
 * POST /api/vehicles/:id/restock  (admin only)
 * @param {string} id
 * @param {number} quantity
 * @returns {Promise<Vehicle>}
 */
export async function restockVehicle(id, quantity) {
  const response = await api.post(`/api/vehicles/${id}/restock`, { quantity })
  return response.data
}
