// jest.setup.js
// Jest globalSetup: runs once before the entire test suite.
// Connects to a dedicated test database so tests never touch production data.

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const TEST_MONGO_URI =
    process.env.MONGO_URI_TEST ||
    "mongodb://127.0.0.1:27017/car_dealership_test_db";

export default async function setup() {
    await mongoose.connect(TEST_MONGO_URI);
}
