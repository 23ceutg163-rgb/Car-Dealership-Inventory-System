import request from "supertest";
import app from "../app.js";

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