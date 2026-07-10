import express from "express";

const router = express.Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
    res.status(201).json({});
});

export default router;
