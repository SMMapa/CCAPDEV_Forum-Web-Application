import { Router } from 'express';
import { ObjectId } from 'mongodb';
import Profile from '../models/Profile.js'
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const editProfileRouter = Router();

editProfileRouter.get('/editProfile', async (req, res) => {
    if(req.session.username) {
        const pr = await Profile.findOne({username: req.session.username}).lean().exec();
        if(pr) {
            let renderObj = {
                name: pr.name,
                bio: pr.bio,
                username: req.session.username,
                head: {
                    username: req.session.username
                }
            }
            res.render("edit",renderObj);
        }else {
            res.sendStatus(403);
        }
    }else {
        res.sendStatus(403);
    }
});

editProfileRouter.put('/update-profile', async (req, res) => {
    const { username, name, bio } = req.body;
    console.log("Request Body:", req.body);
    try {
        const filter = {username: req.session.username}; //makes sure that name matches session username
        const profile = await Profile.findOne(filter).exec();
        if(profile) {
            req.session.name = name;
            profile.name = name;
            profile.bio = bio;
            await profile.save();
            res.sendStatus(200);
            await Post.updateMany(filter, {
                name: name
            });
            await Comment.updateMany(filter, {
                name: name
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default editProfileRouter;
