import { Schema, SchemaTypes, model } from "mongoose";

const credSchema = new Schema({
    email: String,
    password: String,
    username: String,
    role: { 
        type: String, 
        enum: ["admin", "manager", "customer"], 
        default: "customer" 
    },
    failedAttempts: {type: Number, default: 0},
    lockUntil: {type: Date, default: null},
    lastLoginAttempt: { type: Date, default: null }
});

const Credential = model('Credential', credSchema);

export default Credential;