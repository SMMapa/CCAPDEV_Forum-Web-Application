import { Schema, model } from "mongoose";

const logSchema = new Schema({
    type: { type: String, enum: ["input_validation", "auth", "access_control"], required: true },
    timestamp: { type: Date, default: Date.now },
    user: { type: String, default: "null" },
    ip: { type: String },
    endpoint: { type: String },
    payload: { type: Object },
    message: { type: String, required: true }
});

const Log = model("Log", logSchema);

export default Log;
