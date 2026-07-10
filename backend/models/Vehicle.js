import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            // Price must be a non-negative value.
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            // Quantity in stock must be a non-negative integer.
            min: 0,
        },
    },
    { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
