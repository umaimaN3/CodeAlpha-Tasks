const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  taskId: String,        // Kis task ke liye comment
  content: String,       // Comment text
  author: String,        // Kaunne likha
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);