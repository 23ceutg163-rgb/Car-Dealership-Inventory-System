import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addVehicle, getVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

// POST /api/vehicles — protected
router.post("/", protect, addVehicle);

// GET /api/vehicles — protected
router.get("/", protect, getVehicles);

export default router;
