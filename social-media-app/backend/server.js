const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/socialmedia")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log(err);
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req,res)=>{
    res.send("Social Media Server Running");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(5000, ()=>{
    console.log("Server started on port 5000");
});