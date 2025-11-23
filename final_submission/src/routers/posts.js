import { Router } from 'express';
//import { getDb } from '../db/conn.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Profile from '../models/Profile.js';

const postRouter = Router();
postRouter.use(express.json());

postRouter.get('/home', async (req,res) => {
    const postsArr = await Post.find().sort({_id: -1}).lean().exec();
    const top = await Post.find().sort({_id: -1}).limit(5).lean().exec();
    let renderObj = {
        title: "Home",
        posts: postsArr,
        topposts: top
    }
    if(req.session.username) {
        renderObj.user = {
            username: req.session.username,
            name: req.session.name
        };
        renderObj.posts.forEach((element)=> {
            if(element.username===req.session.username) {
                element.me = true
            }
        });
    }
    res.render("home", renderObj);
});

postRouter.post('/make-post', async (req,res) => {
    console.log(req.body);
    if(req.session.username) {
        try {
        await Post.create({
            postid: req.body.postid,
            username: req.session.username,
            name: req.body.name,
            date: req.body.date,
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags,
            hasImage: req.body.hasImage
        })
        res.sendStatus(200);
        }catch(err) {
        console.error(err);
        }
    }else {
        res.redirect('/error');
    }
});

postRouter.get('/posts/:postID', async(req,res) => {
    var postid = req.params.postID;
    const top = await Post.find().sort({_id: -1}).limit(5).lean().exec();
    const post = await Post.findOne({postid: postid}).lean().exec();
    if(post) {
        const comment = await Comment.find({original_postid: postid}).sort({_id:-1}).lean().exec();
        let renderObj = {
            post: post,
            comments: comment,
            topposts: top
        }
        if(req.session.username) {
            renderObj.user = {
                username: req.session.username,
                name: req.session.name
            };
            if(post.username === req.session.username) {
                post.me = true;
            }
        }
        res.render("post_page", renderObj)
    }
    else {
        res.redirect('/error');
    }
});


postRouter.post('/make-comment', async(req,res) => {
    try {
        await Comment.create({
            original_postid: req.body.original_postid,
            commentid: req.body.commentid,
            username: req.session.username,
            name: req.body.name,
            date: req.body.date,
            text: req.body.text
        });
        res.sendStatus(200);
    }catch(err) {
        res.sendStatus(500);
    }
});


postRouter.get('/profiles/:username', async (req,res) => {
    var user = req.params.username;
    const profile = await Profile.findOne({username:user}).lean().exec();
    const postsArr = await Post.find({username:user}).sort({_id: -1}).lean().exec();
    
    if (profile){
        let t = profile.name + " - Profile";
        let renderObj = {
            title: t,
            profile: profile,
            posts: postsArr
        }
        if(req.session.username) {
            renderObj.user = {
                username: req.session.username,
                name: req.session.name
            };
            if(user === req.session.username) {
                renderObj.posts.forEach((element) => {
                    element.me = true;
                })
                renderObj.me = {
                    username: req.session.username
                }
            }
        }
        res.render("profile", renderObj);
    }
    else {
        res.redirect("/error");
    }
});


export default postRouter;