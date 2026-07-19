// models/Message.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
{
    meeting:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        required:true
    },

    agent:{
        type:String,
        enum:[
            "Chairperson",
            "Investor",
            "CTO",
            "ProductUX",
            "Marketing",
            "Security",
            "Customer",
            "DevilsAdvocate",
            "User"
        ],
        required:true
    },

    type:{
        type:String,
        enum:[
            "speaking",
            "challenge",
            "reply",
            "announcement",
            "summary",
            "vote"
        ],
        required:true
    },

    content:{
        type:String,
        required:true
    },

    replyTo: {
    type: String,
    enum: [
        "User",
        "Chairperson",
        "Investor",
        "CTO",
        "ProductUX",
        "Marketing",
        "Security",
        "Customer",
        "DevilsAdvocate"
    ]
},

    confidence:{
        type:Number,
        min:0,
        max:100
    },
    metadata: {
       targetAgent: String
    },
    github: String,
    
attachment: {
    type: {
        type: String,
        enum: ["pdf", "ppt", "image"]
    },

    title: String,

    url: String,

    metadata: {
        fileName: String,
        fileSize: Number,
        mimeType: String,

        cloudinary: {
            publicId: String,
            secureUrl: String
        }
    }
},
},
{
    timestamps:true
});

module.exports = mongoose.model("Message",messageSchema);