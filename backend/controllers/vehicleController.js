import Vehicle from "../models/Vehicle.js";

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Builds a Mongoose filter object from the search query parameters.
 * All parameters are optional and AND-combined when multiple are provided.
 * Invalid numeric values (e.g. non-numeric strings) are silently ignored.
 *
 * @param {object} query - req.query from the Express request
 * @returns {object} Mongoose-compatible filter object
 */
const buildSearchFilter = ({ make, model, category, minPrice, maxPrice }) => {
    const filter = {};

    if (make) filter.make = make;
    if (model) filter.model = model;
    if (category) filter.category = category;

    // Parse price bounds and only apply them when the parsed value is a valid number.
    // This prevents NaN leaking into the Mongoose query from malformed query strings.
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min) || !isNaN(max)) {
        filter.price = {};
        if (!isNaN(min)) filter.price.$gte = min;
        if (!isNaN(max)) filter.price.$lte = max;
    }

    return filter;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

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
 * Results are sorted newest-first for a consistent, predictable response order.
 */
export const searchVehicles = async (req, res) => {
    try {
        const filter = buildSearchFilter(req.query);

        // Apply the same newest-first sort used by getVehicles for consistency.
        const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

        // Return plain objects — consistent with addVehicle and getVehicles.
        return res.status(200).json(vehicles.map((v) => v.toObject()));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
