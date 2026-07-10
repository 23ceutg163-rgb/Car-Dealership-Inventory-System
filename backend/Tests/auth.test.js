import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import User from "../models/User.js";

dotenv.config();

// Connect to the dedicated test database before the suite runs.
// globalSetup runs in a separate process and cannot share a Mongoose connection,
// so we manage the lifecycle here in the test file itself.
const TEST_MONGO_URI =
    process.env.MONGO_URI_TEST ||
    "mongodb://127.0.0.1:27017/car_dealership_test_db";

beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
});

// Clear the users collection before each test to prevent duplicate-email errors
// on repeated test runs.
beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

it("should register a new user", async () => {

    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            email: "test@example.com",
            password: "Password123!"
        });

    expect(response.status).toBe(201);

});