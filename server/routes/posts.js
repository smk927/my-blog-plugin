const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
});

module.exports = router;
