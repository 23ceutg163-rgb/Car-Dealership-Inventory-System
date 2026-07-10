import Vehicle from "../models/Vehicle.js";

/**
 * POST /api/vehicles
 * Creates and persists a new vehicle document.
 */
export const addVehicle = async (req, res) => {
    try {
        const { make, model, category, price, quantity } = req.body;

        const vehicle = await Vehicle.create({ make, model, category, price, quantity });

        return res.status(201).json(vehicle);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
