import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = 10;

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Signs and returns a JWT for a given user document.
 * @param {object} user - Mongoose User document
 * @returns {string} Signed JWT token
 */
const generateToken = (user) =>
    jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

/**
 * Builds a safe user response object, explicitly omitting the password.
 * @param {object} user - Mongoose User document
 * @returns {object} Safe user payload
 */
const buildUserResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
});

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Registers a new user, hashes the password, and returns a JWT.
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password before persisting
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Persist the new user
        const user = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            token: generateToken(user),
            user: buildUserResponse(user),
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/auth/login
 * Finds the user by email, verifies the password, and returns a JWT.
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Explicitly select the password field since it is hidden by default
        // in the schema (select: false) to prevent accidental exposure.
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the provided password against the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        return res.status(200).json({
            token: generateToken(user),
            user: buildUserResponse(user),
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
