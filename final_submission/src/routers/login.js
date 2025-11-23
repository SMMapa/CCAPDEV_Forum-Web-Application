import { Router } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import Credential from '../models/Credential.js';
import Profile from '../models/Profile.js';

const loginRouter = Router();
/*const db = getDb();
const credentials = db.collection('credentials');
*/
loginRouter.get('/login', async(req,res) => {
    if(!req.session.username) {
        res.render('login');
    }
    else {
        var path = '/profiles/' + req.session.username;
        res.redirect(path);
    }
})

loginRouter.post('/go-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve user from database based on the provided handle
        const user = await Credential.findOne({ username: username }).lean().exec();
        const prof = await Profile.findOne({username: username}).lean().exec();
        // Check if user exists and the provided password matches
        if (user && prof) {
            // Authentication successful
            //console.log("user exists");
            bcrypt.compare(password,user.password,function(err,result) {
                if(result) {
                    req.session.username = username;
                    req.session.name = prof.name;
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(401);
                }
            });
        } else {
            // Authentication failed
            res.sendStatus(401);
        
        }
    } catch (error) {
        // Error occurred while processing the request
        console.error('Error:', error);
       res.sendStatus(500);
    }
});

loginRouter.get("/logout", async (req,res) => {
    req.session.destroy();
    res.redirect("/home");
});

export default loginRouter;
