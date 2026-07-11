/**
 * Middleware: verifies that the authenticated user is an admin.
 * Must be used AFTER the protect middleware, which populates req.user.
 * Returns 403 if the user does not have admin privileges.
 */
const adminOnly = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

export default adminOnly;
