import { Schema, SchemaTypes, model } from "mongoose";

const credSchema = new Schema({
    email: String,
    password: String,
    username: String,
    failedAttempts: {type: Number, default: 0},
    lockUntil: {type: Date, default: null},
    lastLoginAttempt: { type: Date, default: null }
});

const Credential = model('Credential', credSchema);

export default Credential;