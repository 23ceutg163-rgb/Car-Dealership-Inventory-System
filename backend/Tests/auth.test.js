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

// ─── POST /api/auth/register ─────────────────────────────────────────────────

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

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

it("should login an existing user and return 200 with a token", async () => {

    // Arrange — seed a registered user via the existing endpoint
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Login User",
            email: "loginuser@example.com",
            password: "Password123!"
        });

    // Act
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "loginuser@example.com",
            password: "Password123!"
        });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "loginuser@example.com");
    expect(response.body.user).not.toHaveProperty("password");

});

it("should return 401 when the password is incorrect", async () => {

    // Arrange — seed a registered user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Login User",
            email: "loginuser@example.com",
            password: "Password123!"
        });

    // Act
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "loginuser@example.com",
            password: "WrongPassword!"
        });

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

it("should return 404 when the email is not registered", async () => {

    // Arrange — no user seeded for this email

    // Act
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "nobody@example.com",
            password: "Password123!"
        });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});