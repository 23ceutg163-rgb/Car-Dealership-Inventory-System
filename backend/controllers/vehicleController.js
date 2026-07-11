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
 * Returns an array of all vehicles in the inventory, sorted by newest first.
 * Each document is converted to a plain object for consistent, clean serialisation.
 */
export const getVehicles = async (req, res) => {
    try {
        // Sort newest-first for a predictable, production-sensible default order.
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });

        // Mirror the addVehicle pattern: return plain objects, not Mongoose documents.
        return res.status(200).json(vehicles.map((v) => v.toObject()));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/vehicles/search
 * Searches vehicles by make, model, category, and/or price range.
 * All query parameters are optional and are AND-combined when multiple are provided.
 */
export const searchVehicles = async (req, res) => {
    try {
        const { make, model, category, minPrice, maxPrice } = req.query;

        // Build the filter object dynamically from whichever query params are present.
        const filter = {};

        if (make) filter.make = make;
        if (model) filter.model = model;
        if (category) filter.category = category;

        // Price range: add $gte and/or $lte only when the respective param is provided.
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(filter);

        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
