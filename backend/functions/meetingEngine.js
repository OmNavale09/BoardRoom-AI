const axios = require("axios");
const Meeting = require("../models/Meeting");
const Project = require("../models/Project");
const Message = require("../models/Message");
/*
=====================================================
Meeting Runtime State
=====================================================
*/
const activeMeetings = new Map();
/*
meetingId => {
    running: true,
    processing: false
}
*/

/*
=====================================================
Start Engine
=====================================================
*/

const startMeetingEngine = async (meetingId, io) => {
    const id = meetingId.toString();
    if (activeMeetings.has(id)) {
        return;
    }
    activeMeetings.set(id, {
        running: true,
        processing: false
    });
    console.log(`Meeting ${id} started.`);
    runMeeting(id, io);
};
/*
=====================================================
Pause
=====================================================
*/
const pauseMeetingEngine = (meetingId) => {
    const state = activeMeetings.get(
        meetingId.toString()
    );
    if (!state) return;
    state.running = false;
    console.log(`Meeting ${meetingId} paused.`);
};
/*
=====================================================
Resume
=====================================================
*/
const resumeMeetingEngine = (meetingId, io) => {
    const id = meetingId.toString();
    const state = activeMeetings.get(id);
    if (!state) {
        activeMeetings.set(id, {
            running: true,
            processing: false
        });
    } else {
        if (state.running)
            return;
        state.running = true;
    }
    console.log(`Meeting ${id} resumed.`);
    runMeeting(id, io);
};
/*
=====================================================
Stop
=====================================================
*/
const stopMeetingEngine = (meetingId) => {
    const id = meetingId.toString();
    activeMeetings.delete(id);
    console.log(`Meeting ${id} stopped.`);
};
/*
=====================================================
Main Loop
=====================================================
*/
const runMeeting = async (meetingId, io) => {
    const state = activeMeetings.get(meetingId);

    if (!state) return;
    if (!state.running) return;
    if (state.processing) return;

    state.processing = true;

    try {

        //------------------------------------------
        // Load Meeting
        //------------------------------------------
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            stopMeetingEngine(meetingId);
            return;
        }

        //------------------------------------------
        // Meeting Finished
        //------------------------------------------
        if (
            meeting.status === "completed" ||
            meeting.status === "stopped"
        ) {
            stopMeetingEngine(meetingId);
            return;
        }

        //------------------------------------------
        // Meeting Paused
        //------------------------------------------
        if (meeting.status === "paused") {
            state.running = false;
            return;
        }

        //------------------------------------------
        // Load Project
        //------------------------------------------
        const project = await Project.findById(meeting.project);

        if (!project) {
            throw new Error("Project not found.");
        }

        //------------------------------------------
        // Load Conversation History
        //------------------------------------------
        const history = await Message.find({
            meeting: meeting._id
        }).sort({
            createdAt: 1
        });

        //------------------------------------------
        // Build Messages Payload
        //------------------------------------------
        const aiMessages = history.map(msg => {
    let attachment = null;

    if (
        msg.attachment &&
        msg.attachment.type &&
        msg.attachment.title &&
        msg.attachment.url
    ) {
        attachment = {
            type: msg.attachment.type,
            title: msg.attachment.title,
            url: msg.attachment.url
        };
    }

    return {
        agent: msg.agent,
        type: msg.type,
        content: msg.content,
        github: msg.github || null,
        attachment
    };
});

        //------------------------------------------
        // Decide Python Action
        //------------------------------------------
        console.log("Length: ",history.length)
        let action = "start";

        if (history.length > 1) {

            const decision = meeting.nextDecision;

            if (!decision) {
                action = "summary";
            } else {

                switch (decision.action) {

                    case "speak":
                    case "challenge":
                    case "reply":
                    case "reply_to_user":
                        action = "member_response";
                        break;

                    case "vote":
                        if (decision.nextSpeaker) {
                            action = "member_response";
                        } else {
                            action = "vote";
                        }
                        break;

                    case "summary":
                        action = "summary";
                        break;

                    default:
                        action = "member_response";
                }
            }
        }

        //------------------------------------------
        // Build Final Payload
        //------------------------------------------
        const payload = {
            action,
            meeting: {
                id: meeting._id,
                title: meeting.title,
                status: meeting.status
            },
            project: {
                id: project._id,
                title: project.title,
                description: project.description
            },
            messages: aiMessages
        };

        //------------------------------------------
        // member_response requires decision
        //------------------------------------------
        if (action === "member_response") {
            payload.decision = meeting.nextDecision;
        }

        //------------------------------------------
        // Call Python Server
        //------------------------------------------
        console.log(
    JSON.stringify(payload, null, 2)
);
        const response = await axios.post(
            `${process.env.PYTHON_SERVER}/meeting`,
            payload,
            {
                timeout: 1000 * 120
            }
        );

        const ai = response.data;

        console.log("AI Response Received", ai);

        //------------------------------------------
        // Save AI Message
        //------------------------------------------
        if (ai.message) {

            const savedMessage = await Message.create({
                meeting: meeting._id,
                agent: ai.message.agent,
                type: ai.message.type,
                content: ai.message.content,
                replyTo: ai.message.replyTo || null,
                confidence: ai.message.confidence,
                metadata: ai.message.metadata || {}
            });

            io.to(meetingId).emit(
                "meeting-message",
                savedMessage
            );
        }

        //------------------------------------------
        // Update Next Decision
        //------------------------------------------
        if (ai.nextDecision) {

            meeting.nextDecision = {
                action: ai.nextDecision.action,
                nextSpeaker: ai.nextDecision.nextSpeaker,
                target: ai.nextDecision.target,
                reason: ai.nextDecision.reason
            };

            await meeting.save();

            io.to(meetingId).emit(
                "meeting-decision",
                meeting.nextDecision
            );
        }

        //------------------------------------------
        // Meeting Finished
        //------------------------------------------
        if (
            !ai.nextDecision ||
            ai.nextDecision.action === "summary"
        ) {

            console.log("Meeting Finished.");

            meeting.status = "completed";

            await meeting.save();

            io.to(meetingId).emit(
                "meeting-completed",
                {
                    meetingId
                }
            );

            stopMeetingEngine(meetingId);

            return;
        }

        //------------------------------------------
        // Small Delay
        //------------------------------------------
        await new Promise(resolve =>
            setTimeout(resolve, 200)
        );

        console.log(`Running Meeting ${meetingId}`);

    }
catch (err) {
    if (err.response) {
        console.log("Status:", err.response.status);
        console.dir(err.response.data, { depth: null });
    } else {
        console.error(err);
    }
}
    finally {

        const current = activeMeetings.get(meetingId);

        if (current) {
            current.processing = false;
        }
    }

    //------------------------------------------
    // Auto Continue
    //------------------------------------------
    const current = activeMeetings.get(meetingId);

    if (
        current &&
        current.running
    ) {
        setTimeout(() => {
            runMeeting(meetingId, io);
        }, 5000);
    }
};
/*
=====================================================
Check if Running
=====================================================
*/
const isMeetingRunning = (meetingId) => {
    return activeMeetings.has(
        meetingId.toString()
    );
};

module.exports = {
    startMeetingEngine,
    pauseMeetingEngine,
    resumeMeetingEngine,
    stopMeetingEngine,
    isMeetingRunning,
    runMeeting
};