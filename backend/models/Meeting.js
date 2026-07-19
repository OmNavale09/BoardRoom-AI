// models/Meeting.js

const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
{
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:String,

    status: {
    type: String,
    enum: [
        "running",
        "paused",
        "completed",
        "stopped"
    ],
    default: "running"
},
    nextDecision: {
    action: String,
    nextSpeaker: String,
    target: String,
    reason: String
}
},
{
    timestamps:true
});

module.exports = mongoose.model("Meeting",meetingSchema);