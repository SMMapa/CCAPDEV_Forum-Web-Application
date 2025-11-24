import { logAccessControl } from "./logger.js";

export function requireRole(...allowedRoles) {
    return async function (req, res, next) {
        if (!req.session.username) {
            await logAccessControl(req, "Access denied: user not logged in");
            return res.status(401).send("Not logged in");
        }

        if (!allowedRoles.includes(req.session.role)) {
            await logAccessControl(req, `Access denied: ${req.session.role} attempted to access restricted route`);
            return res.status(403).send("Forbidden Access");
        }

        next();
    };
}
