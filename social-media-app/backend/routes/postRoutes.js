const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Post = require("../models/Post");

// CREATE POST
router.post("/create", async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) {
      return res.status(400).json("userId and content are required");
    }

    const newPost = new Post({ userId, content });
    await newPost.save();
    res.json("Post Created Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// GET ALL POSTS
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// LIKE POST
router.put("/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid post ID");
    }
    if (!userId) {
      return res.status(400).json("userId is required");
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Post not found");

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(u => u !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// COMMENT POST
router.put("/comment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid post ID");
    }
    if (!userId || !text) {
      return res.status(400).json("userId and text are required");
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Post not found");

    post.comments.push({ userId, text });
    await post.save();
    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;