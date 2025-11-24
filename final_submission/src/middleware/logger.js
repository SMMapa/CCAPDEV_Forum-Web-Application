import Log from "../models/Log.js";

export async function logSecurityEvent(req, type, message) {
    try {
        await Log.create({
            type, // "input_validation", "auth", "access_control"
            user: req.session?.username || req.body?.username || "null",
            ip: req.ip,
            endpoint: req.originalUrl,
            payload: req.body,
            message
        });
    } catch (err) {
        console.error("Failed to log security event:", err);
    }
}

export async function validateField(req, value, fieldName) {
    if (!value || value.trim() === "") {
        await logSecurityEvent(req, "input_validation", `${fieldName} is empty or invalid`);
        return false;
    }
    return true;
}

export async function logAccessControl(req, message) {
    await logSecurityEvent(req, "access_control", message);
}