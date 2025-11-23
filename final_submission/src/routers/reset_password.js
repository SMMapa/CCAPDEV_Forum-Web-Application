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
            return res.sendStatus(403);
        }
    }catch(err) {
        return res.sendStatus(500);
    }
});


resetRouter.post('/reset_send_answers', async (req,res) => {
    const {a1, a2} = req.body;
    const email = req.session.email;
    try {
        let flag1 = 0;
        let flag2 = 0;
        const check1 = await SecQuestion.findOne({email}).lean().exec();
        const check2 = await Credential.findOne({email}).lean().exec();
        if(check1 && check2) {
           
                    bcrypt.compare(a1,check1.answer1,function(err,result) {
                        if(result) {
                            flag1 = 1;
                        }
                    })
                    bcrypt.compare(a2,check1.answer2,function(err,result){
                        if(result) {
                            flag2 = 1;
                        }
                    })
                    if(flag1 && flag2) {
                        return res.sendStatus(200);
                    }
                    else {
                        req.session.destroy();
                        return res.sendStatus(403);
                    }
        }
    }catch(err) {
        return res.sendStatus(500);
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
    }


});




export default resetRouter;