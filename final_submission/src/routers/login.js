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
        const user = await Credential.findOne({ username: username }).exec();
        const prof = await Profile.findOne({username: username}).lean().exec();
        // Check if user exists and the provided password matches
        if (!user || !prof) return res.sendStatus(401);

        // Lockout Check (does not work for some reason)
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.sendStatus(423);
        }
            
        // Password Check
        bcrypt.compare(password,user.password,async(err,result) => {
            if(result) {
                // Authentication successful
                //console.log("user exists");
                user.failedAttempts = 0;
                user.lockUntil = null;
                await user.save();

                req.session.username = username;
                req.session.name = prof.name;
                return res.sendStatus(200);
            }
            else {
                // Authentication failed, increase attempts
                user.failedAttempts += 1;

                if (user.failedAttempts >= 5) {
                    // Lock account for n minutes (n=1, update this if testing)
                    user.lockUntil = new Date(Date.now() + 1 * 60 * 1000);
                }

                await user.save();
                return res.sendStatus(401);
            }
        });
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
