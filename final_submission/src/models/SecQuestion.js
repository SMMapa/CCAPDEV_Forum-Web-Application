import { Schema, SchemaTypes, model } from "mongoose";

const sqSchema = new Schema({
    email: String,
    question1: String,
    answer1: String,
    question2: String,
    answer2: String
});

const SecQuestion = model('SecQuestion', sqSchema);

export default SecQuestion;