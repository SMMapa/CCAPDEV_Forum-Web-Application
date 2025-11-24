import Log from "../models/Log.js";

export async function logInputValidation(req, message) {
    try {
        await Log.create({
            type: "input_validation",
            user: req.session?.username || "anonymous",
            ip: req.ip,
            endpoint: req.originalUrl,
            payload: req.body,
            message
        });
    } catch (err) {
        console.error("Failed to log input validation:", err);
    }
}

export async function logAuthAttempt(req, message, success = false) {
    try {
        await Log.create({
            type: "auth",
            user: req.body.username || "anonymous",
            ip: req.ip,
            endpoint: req.originalUrl,
            payload: req.body,
            message: `${message} - ${success ? "SUCCESS" : "FAILURE"}`
        });
    } catch (err) {
        console.error("Failed to log auth attempt:", err);
    }
}

export async function logAccessControl(req, message) {
    try {
        await Log.create({
            type: "access_control",
            user: req.session?.username || "anonymous",
            ip: req.ip,
            endpoint: req.originalUrl,
            payload: req.body,
            message
        });
    } catch (err) {
        console.error("Failed to log access control:", err);
    }
}