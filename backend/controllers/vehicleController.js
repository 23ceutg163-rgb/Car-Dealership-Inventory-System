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

/**
 * PUT /api/vehicles/:id
 * Partially updates an existing vehicle document using a $set merge.
 * - $set ensures req.body is always treated as a plain field update,
 *   preventing accidental MongoDB operator injection from client input.
 * - runValidators ensures schema constraints (e.g. min:0) apply on update.
 * - returnDocument:'after' is the non-deprecated form of {new:true}.
 * Returns 404 if no vehicle with the given id exists.
 * Returns the updated document as a plain object.
 */
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },          // explicit $set prevents operator injection
            {
                returnDocument: "after", // non-deprecated replacement for { new: true }
                runValidators: true,     // enforce schema constraints (min, required, etc.)
            }
        );

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // Return a plain object — consistent with all other vehicle handlers.
        return res.status(200).json(vehicle.toObject());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE /api/vehicles/:id
 * Admin-only. Permanently removes a vehicle document from the inventory.
 * Returns 404 if no vehicle with the given id exists.
 * On success, returns 200 with a confirmation message and the deleted document's id.
 */
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // Include the deleted id so the client can confirm which document was removed.
        return res.status(200).json({
            message: "Vehicle deleted successfully",
            id: vehicle._id,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/vehicles/:id/purchase
 * Decrements the vehicle's quantity by 1.
 * Returns 404 if no vehicle with the given id exists.
 * Returns 400 if the vehicle has no stock remaining (quantity <= 0).
 *
 * Uses an explicit read → check → write pattern rather than a single
 * atomic findOneAndUpdate so that the out-of-stock guard can be evaluated
 * in application code and return a meaningful 400 error to the client.
 */
export const purchaseVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // Guard against zero AND any unexpected negative quantity in the DB.
        if (vehicle.quantity <= 0) {
            return res.status(400).json({ error: "Vehicle is out of stock" });
        }

        vehicle.quantity -= 1;
        await vehicle.save();

        // Return a plain object — consistent with all other vehicle handlers.
        return res.status(200).json(vehicle.toObject());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/vehicles/:id/restock
 * Admin-only. Increases the vehicle's quantity by the amount in req.body.quantity.
 * Returns 400 if quantity is missing, not a number, or not a positive value.
 * Returns 404 if no vehicle with the given id exists.
 * Returns the updated document as a plain object.
 *
 * The typeof guard is intentional: a string "10" passes !amount but would cause
 * string concatenation instead of numeric addition on vehicle.quantity.
 */
export const restockVehicle = async (req, res) => {
    try {
        const amount = req.body.quantity;

        // Reject missing, non-numeric, and non-positive values before any DB access.
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ error: "Restock quantity must be a positive number" });
        }

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        vehicle.quantity += amount;
        await vehicle.save();

        // Return a plain object — consistent with all other vehicle handlers.
        return res.status(200).json(vehicle.toObject());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
