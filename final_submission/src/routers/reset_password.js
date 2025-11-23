import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import Credential from '../models/Credential.js';
import SecQuestion from '../models/SecQuestion.js';

const resetRouter = Router();


resetRouter.get('/reset', async (req,res) => {
    console.log("test")
    res.render("reset_email");
});

resetRouter.post('/reset-send-email', async (req,res) => {
    const email = req.body;
    if(!email) {
        return res.status(400);
    }
    try {
        const existing = await Credential.findOne({ email }).lean().exec();
        if(existing) {
            return res.sendStatus(200);
        }
    }catch(err) {
        return res.sendStatus(500);
    }
});

export default resetRouter;