import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

import Profile from '../models/Profile.js';
import Credential from '../models/Credential.js';
import SecQuestion from '../models/SecQuestion.js';

const r = 15;
const registerRouter = Router();

const securityQuestions1 = ["Where was your mother born?","What was the name of your childhood imaginary friend?","If you were a robot, what would your serial number be?","What crime would you commit if they allowed you to?","What are the ghosts in your bedroom called?","When your time comes, how would you like to die?"];
const securityQuestions2 = ["Which fictional character would you marry?","What is a recurring motif in your dreams?","Whose face do you see when you put halved ping-pong balls over your eyes and listen to static?","Where did your happiest memory take place?","What is the name of the reptilian entity watching over you?"];

registerRouter.get('/register', async (req,res) => {
    console.log("test")
    
    res.render("register", {
        title: "Register",
        sqones: securityQuestions1,
        sqtwos:securityQuestions2
    });
});


registerRouter.post('/make-user', async (req, res) => {
  console.log("Test");
  console.log(req.body);

  const { email, username, password, name, sq_1, a1, sq_2, a2 } = req.body;

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

    const existing2 = await Credential.findOne({email}).lean().exec();
    if(existing2) {
      return res.sendStatus(403); //email taken
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

    const hash_a1 = await bcrypt.hash(a1,r);
    const hash_a2 = await bcrypt.hash(a2,r);

    const sq = await SecQuestion.create({
      email,
      sq_1,
      hash_a1,
      sq_2,
      hash_a2
    })

    if(!sq) {
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