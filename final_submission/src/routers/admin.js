import { Router } from "express";
import Log from "../models/Log.js";
import { requireRole } from "../middleware/roles.js";

const adminRouter = Router();

// Admin-only route to view security logs
adminRouter.get("/logs", requireRole("admin"), async (req, res) => {
    try {
        // Fetch logs sorted by most recent
        const logs = await Log.find().sort({ timestamp: -1 }).lean();

        // Render logs page
        res.render("admin_logs", { logs });
    } catch (err) {
        console.error("Failed to fetch logs:", err);
        res.status(500).send("Error loading logs");
    }
});

export default adminRouter;
