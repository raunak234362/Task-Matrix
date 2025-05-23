/* eslint-disable prettier/prettier */
// frontend/socket.js
import { io } from "socket.io-client";
// import { BASE_URL } from "./config/constant";


const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"],
  autoConnect:false,
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

  export function connectSocket(userId) {
    if (!userId) return;
    socket.auth = { userId };
    socket.connect();
  }
  

export default socket;
