import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import Profile from '../models/Profile.js';
import Credential from '../models/Credential.js';

const r = 15;
const registerRouter = Router();

registerRouter.get('/register', async (req,res) => {
    console.log("test")
    
    res.render("register", {
        title: "Register"
    });
});


registerRouter.post('/make-user', async (req, res) => {
  console.log("Test");
  console.log(req.body);

  const { email, username, password, name } = req.body;

  const MIN_PASSWORD_LENGTH = 12;
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).send(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
    );
  }
  // - at least one lowercase
  // - at least one uppercase
  // - at least one digit
  // - at least one special character
  const complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

  if (!complexityRegex.test(password)) {
    return res.status(400).send(
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
    );
  }

  try {
    const existing = await Credential.findOne({ username }).lean().exec();

    if (existing) {
      return res.sendStatus(403); // username taken
    }

    const hash = await bcrypt.hash(password, r); // assuming r is your salt rounds

    const cred = await Credential.create({
      email,
      password: hash,
      username
    });

    if (!cred) {
      return res.status(500).send('Could not create credentials');
    }

    const profile = await Profile.create({
      username,
      name,
      bio: "Default bio"
    });


    if(profile) {
      res.sendStatus(200);
    }else {
      return res.status(500).send('Could not create profile');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


registerRouter.get('/login', async (req, res) => {

    res.render("login")
})
export default registerRouter;