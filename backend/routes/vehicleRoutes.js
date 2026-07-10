import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

// POST /api/vehicles — protected
router.post("/", protect, addVehicle);

export default router;
