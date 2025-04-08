/* eslint-disable prettier/prettier */
// frontend/socket.js
import { io } from "socket.io-client";
// import jwtDecode from "jwt-decode";

// const token = localStorage.getItem("authToken");
// const decoded = token ? jwtDecode(token) : null;

const socket = io("http://192.168.1.198:5155", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected with socket:", socket.id);
  socket.emit("joinRoom", "room1"); // Join a room or channel if needed
//   if (decoded?.id) {
//     socket.emit("joinRoom", decoded.id);
//   }
});

export default socket;
