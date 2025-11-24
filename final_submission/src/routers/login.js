import { Router } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import Credential from '../models/Credential.js';
import Profile from '../models/Profile.js';
import { logInputValidation, logAuthAttempt } from '../middleware/logger.js';
import { requireRole } from "../middleware/roles.js";
import { logAccessControl } from "../middleware/logger.js";


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

        if (!username || !password) {
            await logInputValidation(req, "Username or password missing");
            return res.sendStatus(400);
        }

        // Retrieve user from database based on the provided handle
        const user = await Credential.findOne({ username: username }).exec();
        const prof = await Profile.findOne({username: username}).lean().exec();
        // Check if user exists and the provided password matches
        if (!user || !prof) {
            await logAuthAttempt(req, "Username or profile not found", false);
            return res.sendStatus(401);
        }

        // Save the previous login attempt 
        const previousLogin = user.lastLoginAttempt;
        user.lastLoginAttempt = new Date();
        await user.save();

        // Lockout Check (does not work for some reason)
        if (user.lockUntil && user.lockUntil > Date.now()) {
            await logAuthAttempt(req, "Account temporarily locked", false);
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
                req.session.role = user.role;
                req.session.previousLogin = previousLogin;
                await logAuthAttempt(req, "User logged in successfully", true);                
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
                await logAuthAttempt(req, "Incorrect password", false);

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

//managerRouter

const managerRouter = Router();

managerRouter.get(
    "/manager/dashboard",
    requireRole("manager"),
    async (req, res) => {
        await logAccessControl(req, "Manager accessed dashboard");
        res.render("managerDashboard", { username: req.session.username });
    }
);

export default managerRouter;
