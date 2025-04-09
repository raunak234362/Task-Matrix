// components/NotificationReceiver.jsx
import { useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../socket";

const NotificationReceiver = () => {
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("📥 Notification received:", data);

      // Show browser notification
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(data.title || "🔔 New Alert", {
              body: data.message || "You have a new notification.",
            });
          }
        });
      } else {
        new Notification(data.title || "🔔 New Alert", {
          body: data.message || "You have a new notification.",
        });
      }

      // Toast for UI feedback
      toast.success(data.message || "📩 You have a new message!");
    };

    // Listen for notification from server
    socket.on("customNotification", handleNotification);

    // Cleanup on unmount
    return () => {
      socket.off("customNotification", handleNotification);
    };
  }, []);

  return null; // No UI needed, this just listens
};

export default NotificationReceiver;
