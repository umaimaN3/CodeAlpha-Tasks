const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userId:{
        type:String
    },

    content:{
        type:String
    },

    likes:[
        {
            type:String
        }
    ],

    comments:[
        {
            userId:String,
            text:String
        }
    ]

});

module.exports = mongoose.model("Post", postSchema);