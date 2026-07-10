import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    res.send("Car Dealership Inventory System API is Running...");
});

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Database Connection
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("❌ MongoDB Connection Failed");
        console.error(error.message);
    });