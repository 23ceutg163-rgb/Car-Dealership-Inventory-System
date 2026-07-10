
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/api/auth", authRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Car Dealership Inventory System API is Running...");
});

export default app;