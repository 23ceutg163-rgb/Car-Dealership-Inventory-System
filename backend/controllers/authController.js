import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = 10;

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
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Sign a JWT for the newly created user
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return the token and a safe user object (no password)
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
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

        // Look up the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the provided password against the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Sign a JWT for the authenticated user
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return the token and a safe user object (no password)
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
