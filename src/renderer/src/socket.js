/* eslint-disable prettier/prettier */
// frontend/socket.js
import { io } from "socket.io-client";
// import { BASE_URL } from "./config/constant";

const userId= sessionStorage.getItem("userId" );
console.log("User ID from sessionStorage:", userId);

const socket = io("https://192.168.1.157:5154", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected with socket:", socket.id);
  console.log("✅ Connected with userID:", userId);
  // if (userId) {
  //   socket.emit("joinRoom", userId);
  //   console.log(`🔐 Joined room: ${userId}`);
  // }
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
