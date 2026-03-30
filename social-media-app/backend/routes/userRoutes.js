const express = require("express");
const router = express.Router();

const User = require("../models/User");


// REGISTER USER
router.post("/register", async (req,res)=>{

try{

const newUser = new User({
username:req.body.username,
email:req.body.email,
password:req.body.password
});

await newUser.save();

res.json("User Registered Successfully");

}catch(err){

res.status(500).json(err);

}

});


// LOGIN USER
router.post("/login", async (req,res)=>{

try{

const user = await User.findOne({ email: req.body.email });

if(!user){
return res.status(404).json("User not found");
}

if(user.password !== req.body.password){
return res.status(400).json("Wrong password");
}

res.json({
message:"Login Successful",
user:user
});

}catch(err){

res.status(500).json(err);

}

});


module.exports = router;