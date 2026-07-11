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

// ─── GET /api/vehicles/search ─────────────────────────────────────────────────

it("should return 200 with vehicles matching the make query", async () => {

    // Arrange — seed two vehicles with different makes
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
        .get("/api/vehicles/search?make=Toyota")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("make", "Toyota");

});

it("should return 200 with vehicles matching the model query", async () => {

    // Arrange — seed two vehicles with different models
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity: 8 });

    // Act
    const response = await request(app)
        .get("/api/vehicles/search?model=Corolla")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("model", "Corolla");

});

it("should return 200 with vehicles matching the category query", async () => {

    // Arrange — seed vehicles in different categories
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Ford", model: "F-150", category: "Truck", price: 40000, quantity: 3 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Sedan", price: 20000, quantity: 5 });

    // Act
    const response = await request(app)
        .get("/api/vehicles/search?category=Sedan")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((v) => v.category === "Sedan")).toBe(true);

});

it("should return 200 with vehicles within the specified price range", async () => {

    // Arrange — seed vehicles at different price points
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Ford", model: "F-150", category: "Truck", price: 40000, quantity: 3 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Hatchback", price: 20000, quantity: 5 });

    // Act — search for vehicles between 20000 and 30000
    const response = await request(app)
        .get("/api/vehicles/search?minPrice=20000&maxPrice=30000")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((v) => v.price >= 20000 && v.price <= 30000)).toBe(true);

});

it("should return 200 with vehicles matching combined make and category filters", async () => {

    // Arrange — seed vehicles across makes and categories
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Hilux", category: "Truck", price: 38000, quantity: 4 });

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Sedan", price: 20000, quantity: 5 });

    // Act — only Toyota Sedans
    const response = await request(app)
        .get("/api/vehicles/search?make=Toyota&category=Sedan")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("make", "Toyota");
    expect(response.body[0]).toHaveProperty("category", "Sedan");

});

it("should return 200 with an empty array when no vehicles match the search", async () => {

    // Arrange — seed a vehicle that will NOT match
    const token = await registerAndLogin();

    await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    // Act — search for a make that doesn't exist
    const response = await request(app)
        .get("/api/vehicles/search?make=Ferrari")
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);

});

it("should return 401 when no token is provided for search", async () => {

    // Arrange — no token

    // Act
    const response = await request(app)
        .get("/api/vehicles/search?make=Toyota");

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── PUT /api/vehicles/:id ────────────────────────────────────────────────────

it("should update a vehicle and return 200 with the updated data", async () => {

    // Arrange — seed a vehicle via the existing POST endpoint, then get its _id
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    const vehicleId = createRes.body._id;

    // Act — update the price and quantity
    const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ price: 27000, quantity: 8 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", vehicleId);
    expect(response.body).toHaveProperty("make", "Toyota");
    expect(response.body).toHaveProperty("model", "Camry");
    expect(response.body).toHaveProperty("price", 27000);
    expect(response.body).toHaveProperty("quantity", 8);

});

it("should return 404 when updating a vehicle that does not exist", async () => {

    // Arrange — use a valid but non-existent MongoDB ObjectId
    const token = await registerAndLogin();
    const nonExistentId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .put(`/api/vehicles/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ price: 30000 });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});

it("should return 401 when no token is provided for PUT /api/vehicles/:id", async () => {

    // Arrange — no token, any id
    const fakeId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .send({ price: 30000 });

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── DELETE /api/vehicles/:id (Admin only) ────────────────────────────────────

/**
 * Creates an admin user directly in the DB (bypassing register which forces isAdmin:false),
 * then logs in via the existing login endpoint to receive a JWT with isAdmin:true in payload.
 * The password is pre-hashed so the login endpoint can compare it correctly.
 */
const registerAndLoginAsAdmin = async () => {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash("AdminPass123!", 10);

    const User = (await import("../models/User.js")).default;
    await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
    });

    const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@example.com", password: "AdminPass123!" });

    return res.body.token;
};

it("should delete a vehicle and return 200 with a confirmation message", async () => {

    // Arrange — seed a vehicle as a regular user, then delete it as admin
    const token = await registerAndLogin();
    const adminToken = await registerAndLoginAsAdmin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    const vehicleId = createRes.body._id;

    // Act
    const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set("Authorization", `Bearer ${adminToken}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");

});

it("should return 403 when a non-admin user attempts to delete a vehicle", async () => {

    // Arrange — seed a vehicle and try to delete it with a regular (non-admin) token
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Hatchback", price: 20000, quantity: 5 });

    const vehicleId = createRes.body._id;

    // Act — regular user, NOT an admin
    const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set("Authorization", `Bearer ${token}`);

    // Assert — must be forbidden, not just unauthorised
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");

});

it("should return 404 when deleting a vehicle that does not exist", async () => {

    // Arrange — admin token, but a valid non-existent ObjectId
    const adminToken = await registerAndLoginAsAdmin();
    const nonExistentId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .delete(`/api/vehicles/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});

it("should return 401 when no token is provided for DELETE /api/vehicles/:id", async () => {

    // Arrange — no token
    const fakeId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .delete(`/api/vehicles/${fakeId}`);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── POST /api/vehicles/:id/purchase ─────────────────────────────────────────

it("should purchase a vehicle and return 200 with the updated quantity", async () => {

    // Arrange — seed a vehicle with quantity 5
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 5 });

    const vehicleId = createRes.body._id;

    // Act — purchase one unit
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set("Authorization", `Bearer ${token}`);

    // Assert — quantity must have decreased by exactly 1
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("quantity", 4);

});

it("should return 400 when attempting to purchase an out-of-stock vehicle", async () => {

    // Arrange — seed a vehicle with quantity 0 (out of stock)
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Honda", model: "Civic", category: "Hatchback", price: 20000, quantity: 0 });

    const vehicleId = createRes.body._id;

    // Act — attempt to purchase when stock is zero
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set("Authorization", `Bearer ${token}`);

    // Assert — must be rejected before decrement to avoid going below 0
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

});

it("should return 404 when purchasing a vehicle that does not exist", async () => {

    // Arrange — valid ObjectId format but not in the database
    const token = await registerAndLogin();
    const nonExistentId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .post(`/api/vehicles/${nonExistentId}/purchase`)
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});

it("should return 401 when no token is provided for POST /api/vehicles/:id/purchase", async () => {

    // Arrange — no token
    const fakeId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .post(`/api/vehicles/${fakeId}/purchase`);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── POST /api/vehicles/:id/restock (Admin only) ─────────────────────────────

it("should restock a vehicle and return 200 with the updated quantity", async () => {

    // Arrange — seed a vehicle with quantity 3, restock with 10 units
    const token = await registerAndLogin();
    const adminToken = await registerAndLoginAsAdmin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Ford", model: "F-150", category: "Truck", price: 40000, quantity: 3 });

    const vehicleId = createRes.body._id;

    // Act — admin adds 10 units
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 10 });

    // Assert — quantity must be the original (3) plus the restocked amount (10)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("quantity", 13);

});

it("should return 400 when restock quantity is missing", async () => {

    // Arrange — admin token, existing vehicle, but no quantity in body
    const token = await registerAndLogin();
    const adminToken = await registerAndLoginAsAdmin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Ford", model: "Mustang", category: "Coupe", price: 35000, quantity: 5 });

    const vehicleId = createRes.body._id;

    // Act — send body without quantity
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

});

it("should return 400 when restock quantity is not a positive number", async () => {

    // Arrange — admin token, existing vehicle, quantity: 0 (invalid — zero adds nothing)
    const token = await registerAndLogin();
    const adminToken = await registerAndLoginAsAdmin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "BMW", model: "X5", category: "SUV", price: 60000, quantity: 5 });

    const vehicleId = createRes.body._id;

    // Act — zero is not a valid restock amount
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 0 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

});

it("should return 404 when restocking a vehicle that does not exist", async () => {

    // Arrange — admin token, valid non-existent ObjectId
    const adminToken = await registerAndLoginAsAdmin();
    const nonExistentId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .post(`/api/vehicles/${nonExistentId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 10 });

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});

it("should return 403 when a non-admin user attempts to restock a vehicle", async () => {

    // Arrange — regular user token (not admin)
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Tesla", model: "Model S", category: "Sedan", price: 80000, quantity: 2 });

    const vehicleId = createRes.body._id;

    // Act — regular user, NOT an admin
    const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 5 });

    // Assert — must be forbidden, not just unauthorised
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");

});

it("should return 401 when no token is provided for POST /api/vehicles/:id/restock", async () => {

    // Arrange — no token
    const fakeId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .post(`/api/vehicles/${fakeId}/restock`)
        .send({ quantity: 10 });

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});

// ─── GET /api/vehicles/:id ────────────────────────────────────────────────────

it("should return 200 with the correct vehicle when given a valid id", async () => {

    // Arrange — seed a vehicle, capture its _id
    const token = await registerAndLogin();

    const createRes = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({ make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 10 });

    const vehicleId = createRes.body._id;

    // Act
    const response = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set("Authorization", `Bearer ${token}`);

    // Assert — response must match the seeded vehicle exactly
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", vehicleId);
    expect(response.body).toHaveProperty("make", "Toyota");
    expect(response.body).toHaveProperty("model", "Camry");
    expect(response.body).toHaveProperty("category", "Sedan");
    expect(response.body).toHaveProperty("price", 25000);
    expect(response.body).toHaveProperty("quantity", 10);

});

it("should return 404 when the vehicle id does not exist", async () => {

    // Arrange — valid ObjectId format but not in the database
    const token = await registerAndLogin();
    const nonExistentId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .get(`/api/vehicles/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");

});

it("should return 401 when no token is provided for GET /api/vehicles/:id", async () => {

    // Arrange — no token
    const fakeId = new mongoose.Types.ObjectId();

    // Act
    const response = await request(app)
        .get(`/api/vehicles/${fakeId}`);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

});
