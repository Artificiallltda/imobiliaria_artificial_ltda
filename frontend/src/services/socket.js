// src/services/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ["polling", "websocket"], // ✅ não força websocket
});