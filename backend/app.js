
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get("/", (req, res) => {
    res.send("Car Dealership Inventory System API is Running...");
});

export default app;