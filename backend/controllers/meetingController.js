const fs = require("fs");
const Project = require("../models/Project");
const Meeting = require("../models/Meeting");
const Message = require("../models/Message")
const uploadToCloudinary = require("../functions/upload");
const {
    pauseMeetingEngine,
    resumeMeetingEngine,
    stopMeetingEngine,
    runMeeting
} = require("../functions/meetingEngine");
/*
==========================================================
Start Meeting
==========================================================
*/
const startMeeting = async (req, res) => {
    try {
        const {
            projectId,
            title,
            text,
            github
        } = req.body;
        //--------------------------------------------------
        // Validate Input
        //--------------------------------------------------
        if (!title || !text) {
            return res.status(400).json({
               success: false,
                message: "Title and text are required."
            });
        }

        //--------------------------------------------------
        // Find / Create Project
        //--------------------------------------------------
        let project;

        if (projectId) {
            project = await Project.findById(projectId);
        }

        if (!project) {
            project = await Project.create({
                title,
                owner: req.user._id,
                description: text || ""
            });
        }

        //--------------------------------------------------
        // Create Meeting
        //--------------------------------------------------
        const meeting = await Meeting.create({
            project: project._id,
            createdBy: req.user._id,
            title: title || `${project.title} Board Meeting`,
            status: "running",
            nextDecision: null
        });

        //--------------------------------------------------
        // Prepare Attachment
        //--------------------------------------------------
        let attachment = undefined;

        if (req.file) {

            const uploadResult = await uploadToCloudinary(req.file.path);

            attachment = {
                type:
                    req.file.mimetype === "application/pdf"
                        ? "pdf"
                        : req.file.mimetype.includes("presentation")
                        ? "ppt"
                        : "image",

                title: req.file.originalname,

                url: uploadResult.secure_url,

                metadata: {
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,

                    cloudinary: {
                        publicId: uploadResult.public_id,
                        secureUrl: uploadResult.secure_url
                    }
                }
            };

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        //--------------------------------------------------
        // Create First User Message
        //--------------------------------------------------
        const message = await Message.create({

            meeting: meeting._id,

            agent: "User",

            type: "speaking",

            content: text || "",

            github: github || null,

            attachment

        });

        //--------------------------------------------------
        // Start AI Engine
        //--------------------------------------------------
        const { startMeetingEngine } = require("../functions/meetingEngine");

        const io = req.app.get("io");

        startMeetingEngine(meeting._id, io);

        //--------------------------------------------------
        // Response
        //--------------------------------------------------
        return res.status(201).json({
            success: true,
            message: "Meeting started successfully.",
            meeting,
            firstMessage: message
        });

    } catch (err) {

        console.error(err);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
/*
==========================================================
Meeting Actions
==========================================================
*/
const meetingAction = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { action } = req.body;
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found."
            });
        }
        const io = req.app.get("io");
        switch (action) {
            //--------------------------------------------------
            // Pause
            //--------------------------------------------------
            case "pause":
                if (meeting.status === "paused") {
                    return res.status(400).json({
                        success: false,
                        message: "Meeting is already paused."
                    });
                }
                meeting.status = "paused";
                await meeting.save();
                pauseMeetingEngine(meetingId);
                io.to(meetingId).emit("meeting-paused", {
                    meetingId,
                    status: "paused"
                });
                return res.json({
                    success: true,
                    message: "Meeting paused successfully."
                });
            //--------------------------------------------------
            // Resume
            //--------------------------------------------------
            case "resume":
                if (meeting.status !== "paused") {
                    return res.status(400).json({
                        success: false,
                        message: "Meeting is not paused."
                    });
                }
                meeting.status = "running";
                await meeting.save();
                resumeMeetingEngine(meetingId, io);
                io.to(meetingId).emit("meeting-resumed", {
                    meetingId,
                    status: "running"
                });
                return res.json({
                    success: true,
                    message: "Meeting resumed successfully."
                });
            //--------------------------------------------------
            // Stop
            //--------------------------------------------------
            case "stop":
                meeting.status = "stopped";
                await meeting.save();
                stopMeetingEngine(meetingId);
                io.to(meetingId).emit("meeting-stopped", {
                    meetingId,
                    status: "stopped"
                });
                return res.json({
                    success: true,
                    message: "Meeting stopped successfully."
                });
            //--------------------------------------------------
            // Start Voting
            //--------------------------------------------------
            case "vote":
                meeting.nextDecision = {
                    action: "vote",
                    reason: "User forced voting"
                };
                meeting.status = "running";
                await meeting.save();
                runMeeting(meetingId, io);
                return res.json({
                    success: true,
                    message: "Voting started."
                });
            //--------------------------------------------------
            // Skip Current Speaker
            //--------------------------------------------------
            case "skip":
                resumeMeetingEngine(meetingId, io);
                return res.json({
                    success: true,
                    message: "Skipped current turn."
                });
            //--------------------------------------------------
            case "user_message":
                const { content } = req.body;
                if (!content || content.trim() === "") {
                    return res.status(400).json({
                        success: false,
                        message: "Message content is required."
                    });
                }

                await Message.create({
                meeting: meetingId,
                agent: "User",
                type: "speaking",
                content,
                replyTo: null,
                confidence: null,
                metadata: {}
            });

            runMeeting(meetingId, io);

    return res.json({
        success: true,
        message: "User message added."
    });
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid action."
                });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
module.exports = {
    startMeeting,
    meetingAction
};