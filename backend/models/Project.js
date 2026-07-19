// models/Project.js

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
{
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:String,

    category:String,

    stage:{
        type:String,
        enum:["Idea","Prototype","MVP","Startup"],
        default:"Idea"
    },

    status:{
        type:String,
        enum:["Draft","Active","Archived"],
        default:"Draft"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Project",projectSchema);