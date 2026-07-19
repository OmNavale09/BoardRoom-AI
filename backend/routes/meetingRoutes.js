const express = require("express");
const router = express.Router();
const upload = require("../functions/multer");
const protect = require('../functions/protect')

const {
    startMeeting,
    meetingAction,
    sendMessage
} = require("../controllers/meetingController");

router.post(
    "/start",
    protect,
    upload.single("file"),
    startMeeting
);

router.post(
    "/:meetingId/action",
    protect,
    meetingAction
);

module.exports = router;