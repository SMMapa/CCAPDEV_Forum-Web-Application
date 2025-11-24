export function requireRole(...allowedRoles) {
    return function (req, res, next) {
        if (!req.session.username) {
            return res.status(401).send("Not logged in");
        }

        if (!allowedRoles.includes(req.session.role)) {
            return res.status(403).send("Forbidden");
        }

        next();
    };
}