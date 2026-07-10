// jest.teardown.js
// Jest globalTeardown: runs once after the entire test suite.
// Drops the test database and closes the connection cleanly.

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const TEST_MONGO_URI =
    process.env.MONGO_URI_TEST ||
    "mongodb://127.0.0.1:27017/car_dealership_test_db";

export default async function teardown() {
    // Re-connect if the connection was closed between setup and teardown
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_MONGO_URI);
    }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}
