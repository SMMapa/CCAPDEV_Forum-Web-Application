
import { Router } from "express";
import { requireRole } from "../middleware/roles.js";

const adminManagerRouter = Router();

// Shared access between admin + manager
adminManagerRouter.get(
    "/inventory",
    requireRole("admin", "manager"),
    (req, res) => {
        res.render("inventory", {
            username: req.session.username,
            role: req.session.role
        });
    }
);

// Example: Add product

export default adminManagerRouter;
