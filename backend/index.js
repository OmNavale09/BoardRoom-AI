require("dotenv").config();

const PORT = process.env.PORT || 5000;
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");

const User = require("./models/User");
const Project = require("./models/Project");
const Meeting = require("./models/Meeting");
const Message = require('./models/Message')
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set("io", io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
  );
};

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    socket.on("join-meeting", (meetingId) => {
        socket.join(meetingId);
        console.log(socket.id, "joined", meetingId);
    });
    socket.on("leave-meeting", (meetingId) => {
        socket.leave(meetingId);
    });
    socket.on("disconnect", () => {
        console.log(socket.id, "Disconnected");
    });
});


const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.use("/meetings", meetingRoutes);

app.get("/meetings/:meetingId/messages", protect, async (req, res) => {
    try {
        const { meetingId } = req.params;

        const meeting = await Meeting.findOne({
            _id: meetingId,
            createdBy: req.user._id
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        const messages = await Message.find({
            meeting: meetingId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            meeting: {
                id: meeting._id,
                title: meeting.title,
                status: meeting.status,
                nextDecision: meeting.nextDecision
            },
            messages
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch message history"
        });
    }
});

app.get("/meeting/titles", protect, async (req, res) => {
    try {
        const meetings = await Meeting.find({
            createdBy: req.user._id
        })
        .populate("project", "_id title")
        .select("_id title status project")
        .sort({ createdAt: -1 });

        const data = meetings.map(meeting => ({
            meetingId: meeting._id,
            meetingTitle: meeting.title,
            status: meeting.status,
            projectId: meeting.project?._id,
            projectTitle: meeting.project?.title
        }));

        res.status(200).json({
            success: true,
            meetings: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meetings."
        });
    }
});

app.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});