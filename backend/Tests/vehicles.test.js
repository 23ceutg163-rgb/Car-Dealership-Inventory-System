import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import User from "../models/User.js";

dotenv.config();

// Connect to the dedicated test database before the suite runs.
const TEST_MONGO_URI =
    process.env.MONGO_URI_TEST ||
    "mongodb://127.0.0.1:27017/car_dealership_test_db";

beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
});

// Clear all collections before each test for a clean slate.
beforeEach(async () => {
    await User.deleteMany({});
    // Vehicle collection will be cleared once the model exists.
    // Using optional chaining on the model to avoid errors in RED phase.
    const Vehicle = mongoose.models.Vehicle;
    if (Vehicle) await Vehicle.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Registers a user and returns the JWT token.
 * Reuses the existing register endpoint to avoid duplicating setup logic.
 */
const registerAndLogin = async () => {
    const res = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Vehicle Tester",
            email: "vehicletester@example.com",
            password: "Password123!"
        });
    return res.body.token;
};

// ─── POST /api/vehicles ───────────────────────────────────────────────────────

it("should add a new vehicle and return 201 with the vehicle data", async () => {

    // Arrange — obtain a valid JWT via the existing register endpoint
    const token = await registerAndLogin();

    const newVehicle = {
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 25000,
        quantity: 10,
    };

    // Act
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send(newVehicle);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("make", "Toyota");
    expect(response.body).toHaveProperty("model", "Camry");
    expect(response.body).toHaveProperty("category", "Sedan");
    expect(response.body).toHaveProperty("price", 25000);
    expect(response.body).toHaveProperty("quantity", 10);

});

it("should return 401 when no token is provided", async () => {

    // Arrange — no token

    // Act
    const response = await request(app)
        .post("/api/vehicles")
        .send({
            make: "Honda",
            model: "Civic",
            category: "Sedan",
            price: 22000,
            quantity: 5,
        });

    // Assert — protected route must reject unauthenticated requests
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── GET /api/vehicles ────────────────────────────────────────────────────────

it("should return 200 with an array of all vehicles", async () => {

    // Arrange — obtain a token and seed two vehicles
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Hatchback", price: 20000, quantity: 5 });

    // Act
    const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("make");
    expect(response.body[0]).toHaveProperty("model");
    expect(response.body[0]).toHaveProperty("price");
    expect(response.body[0]).toHaveProperty("quantity");

});

it("should return 200 with an empty array when no vehicles exist", async () => {

    // Arrange — obtain a token, seed no vehicles

    const token = await registerAndLogin();

    // Act
    const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);

});

it("should return 401 when no token is provided for GET /api/vehicles", async () => {

    // Arrange — no token

    // Act
    const response = await request(app)
        .get("/api/vehicles");

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});
