
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/api/auth", authRoutes);

// Vehicle Routes
app.use("/api/vehicles", vehicleRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Car Dealership Inventory System API is Running...");
});

export default app;