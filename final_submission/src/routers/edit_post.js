import { Router } from 'express';
import { ObjectId } from 'mongodb';
import Profile from '../models/Profile.js'
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const editPostRouter = Router();

editPostRouter.get('/editPost/:postId', async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findOne({postid: postId, username: req.session.username}).lean().exec();
    if(post) {
        console.log(post);
        let tagstring = "";
        if(post.tags) {
            tagstring = post.tags.join(",");
        }
        let renderObj = {
            postid: post.postid,
            title: post.title,
            body: post.body,
            username: post.username,
            tags: tagstring,
            name: post.name,
            user: {username: req.session.username,
                name: req.session.name}
                
        }
        res.render("edit_post",renderObj);
    }
    else {
        res.redirect('/error');
    }
    /*
    try {
        const post = await Post.findOne({ postid: postId });
        const user = await Profile.findOne({ username: username });
        console.log(post);
        console.log(user);
        if (post && user) {
            res.render("edit_post", {
                title: "Edit Profile",
                post: post,
                name: user.name,
                username: user.username,
                bio: user.bio
            });
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send("Internal server error");
    }
    */
});

editPostRouter.put('/update-post', async (req, res) => {
    const check1 = await Post.findOne({postid: req.body.postid, username: req.session.username}).exec();
    if(check1) {
        console.log(check1);
        console.log(req.body);
        check1.title = req.body.title;
        check1.body = req.body.body;
        check1.tags = req.body.tags;
        check1.date = req.body.date;
        await check1.save();
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
});

export default editPostRouter;
