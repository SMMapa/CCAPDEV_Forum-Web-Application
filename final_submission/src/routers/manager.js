import { Router } from "express";
import { requireRole } from "../middleware/roles.js";

const managerRouter = Router();

// Manager dashboard
managerRouter.get(
    "/manager/dashboard",
    requireRole("manager"),
    (req, res) => {
        res.render("managerDashboard", {
            username: req.session.username,
            role: req.session.role,
            loginTime: req.session.previousLogin
        });
    }
);

// Example: Approve order (MANAGERS ONLY)
managerRouter.post(
    "/manager/approve-order/:id",
    requireRole("manager"),
    (req, res) => {
        const orderId = req.params.id;
        console.log("Order approved by manager:", orderId);
        res.sendStatus(200);
    }
);

export default managerRouter;
