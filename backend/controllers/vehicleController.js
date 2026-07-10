import Vehicle from "../models/Vehicle.js";

/**
 * POST /api/vehicles
 * Creates and persists a new vehicle document.
 * Returns the saved vehicle as a plain object (no Mongoose prototype overhead).
 */
export const addVehicle = async (req, res) => {
    try {
        const { make, model, category, price, quantity } = req.body;

        const vehicle = await Vehicle.create({ make, model, category, price, quantity });

        // Convert Mongoose document to a plain object before sending.
        // This ensures a clean JSON response without internal Mongoose metadata.
        return res.status(201).json(vehicle.toObject());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/vehicles
 * Returns an array of all vehicles in the inventory.
 */
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
