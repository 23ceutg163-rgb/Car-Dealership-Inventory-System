/**
 * Middleware: verifies that the authenticated user has admin privileges.
 *
 * IMPORTANT: Must always be placed AFTER the `protect` middleware in the
 * middleware chain. `protect` is responsible for verifying the JWT and
 * setting req.user from the decoded payload (which includes `isAdmin`).
 *
 * Returns 403 Forbidden if req.user.isAdmin is false or absent.
 */
const adminOnly = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

export default adminOnly;
