import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import Credential from '../models/Credential.js';
import SecQuestion from '../models/SecQuestion.js';
import { logSecurityEvent, validateField } from "../middleware/logger.js";

const r = 15;
const resetRouter = Router();


resetRouter.get('/reset', async (req,res) => {
    console.log("test")
    res.render("reset_email");
});

resetRouter.get('/set_new', async (req,res) => {
    if(req.session.anon_valid) {
        res.render("set_new");
    }else {
         req.session.destroy();
         res.redirect("/error");
    }
})

resetRouter.post('/set_new_pw', async (req,res) => {
    if(req.session.anon_valid && req.session.email) {
        const {o,n,c} = req.body;
        const email = req.session.email;
        const cred = await Credential.findOne({email}).lean().exec();
        bcrypt.compare(o,cred.password,async (err,result) => {
            if(result && (n === c)) {
                const hash = await bcrypt.hash(n, r);
                await Credential.findOneAndUpdate({email},{$set: {password:hash}});
                await logSecurityEvent(req, "auth", "Password successfully changed");
                res.sendStatus(200);
                req.session.destroy();
            }
            else
            {
                req.session.destroy();
                return res.sendStatus(403);
            }
        })
    }else
            {
                req.session.destroy();
                return res.sendStatus(403);
            }
})

resetRouter.post('/send_email', async (req,res) => {
    const email = req.body.email;
    if(!email) {
        return res.status(400);
    }
    try {
        const existing = await Credential.findOne({ email }).lean().exec();
        if(existing) {
            req.session.anonymous = 1;
            req.session.email = email;
            return res.sendStatus(200);
        }
        else {
            await logSecurityEvent(req, "auth", "Incorrect email during password reset");
            req.session.destroy();
            return res.sendStatus(403);
        }
    }catch(err) {
        req.session.destroy();
        return res.sendStatus(500);
    }
});


resetRouter.post('/reset_send_answers', async (req,res) => {
    const {a1, a2} = req.body;
    const email = req.session.email;
    if(email) {
        try {
        const check1 = await SecQuestion.findOne({email}).lean().exec();
        const check2 = await Credential.findOne({email}).lean().exec();
        if(check1 && check2) {
           
                    bcrypt.compare(a1,check1.answer1,async(err,result) => {
                        if(result) {
                            bcrypt.compare(a2,check1.answer2,async(err,result1) => {
                             if(result1) {
                                req.session.anon_valid = 1;
                                return res.sendStatus(200);
                                }else {
                                    await logSecurityEvent(req, "auth", "Incorrect SQ answer");
                                    req.session.destroy();
                                    return res.sendStatus(403);
                                }
                            })
                        }
                    else {
                        await logSecurityEvent(req, "auth", "Incorrect SQ answer");
                        req.session.destroy();
                        return res.sendStatus(403);
                    }}) 
        }
         }catch(err) {
        await logSecurityEvent(req, "auth", "Incorrect SQ answer");
        req.session.destroy();
        return res.sendStatus(500);
        }
    }else {
        await logSecurityEvent(req, "auth", "Malformed");
        req.session.destroy();
        res.redirect("/error");
    }
})

resetRouter.get('/reset_q', async (req,res) => {
    const email = req.session.email;
    if(email) {
        try {
            const questions = await SecQuestion.findOne({email}).lean().exec();
            if(questions) {
                const question1 = questions.question1;
                const question2 = questions.question2;
                let renderObj = {
                    q1: question1,
                    q2: question2
            }
                res.render("reset_sqs",renderObj);
            }else {
                return res.sendStatus(500);
            }
        }catch(err) {
            return res.sendStatus(500);
        }
    } else {
         req.session.destroy();
        res.redirect("/error");
    }


});




export default resetRouter;