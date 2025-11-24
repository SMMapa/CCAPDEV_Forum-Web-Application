
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
adminManagerRouter.post(
    "/inventory/add",
    requireRole("admin", "manager"),
    (req, res) => {
        console.log("Product added:", req.body);
        res.sendStatus(201);
    }
);

export default adminManagerRouter;
