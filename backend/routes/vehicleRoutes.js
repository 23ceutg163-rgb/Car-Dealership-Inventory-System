import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { addVehicle, getVehicles, searchVehicles, updateVehicle, deleteVehicle, purchaseVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

// POST /api/vehicles — protected
router.post("/", protect, addVehicle);

// GET /api/vehicles/search — protected
// Must be registered BEFORE GET / to prevent Express matching 'search' as a param.
router.get("/search", protect, searchVehicles);

// GET /api/vehicles — protected
router.get("/", protect, getVehicles);

// PUT /api/vehicles/:id — protected
router.put("/:id", protect, updateVehicle);

// DELETE /api/vehicles/:id — admin only
router.delete("/:id", protect, adminOnly, deleteVehicle);

// POST /api/vehicles/:id/purchase — protected
router.post("/:id/purchase", protect, purchaseVehicle);

export default router;
