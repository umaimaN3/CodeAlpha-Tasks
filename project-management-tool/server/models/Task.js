const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    default: "Pending", // default status
  },
  projectId: String, // project ke saath link
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);