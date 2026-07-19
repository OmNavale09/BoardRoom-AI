// socket.js
import { io } from "socket.io-client";

const socket = io("https://boardroom-backend-k5un.onrender.com", {
    transports: ["websocket"],
});

export default socket;