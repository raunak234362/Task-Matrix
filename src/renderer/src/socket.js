/* eslint-disable prettier/prettier */
// frontend/socket.js
import { io } from "socket.io-client";

const userId= sessionStorage.getItem("userId" );
console.log("User ID from sessionStorage:", userId);

const socket = io("http://192.168.1.198:5155", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected with socket:", socket.id);
  if (userId) {
    socket.emit("joinRoom", userId);
    console.log(`🔐 Joined room: ${userId}`);
  }
});

socket.on("customNotification", (data) => {
    console.log(data);
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(() => {
        new Notification(data.title || "Task Alert", {
          body: data.message,
        });
      });
    } else {
      new Notification(data.title || "Task Alert", {
        body: data.message,
      });
    }
  });
  

export default socket;
