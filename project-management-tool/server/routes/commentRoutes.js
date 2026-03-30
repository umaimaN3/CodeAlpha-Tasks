const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

// CREATE COMMENT
router.post("/create", async (req, res) => {
  try {
    const { taskId, content, author } = req.body;
    const newComment = new Comment({ taskId, content, author });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET COMMENTS BY TASK
router.get("/:taskId", async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;