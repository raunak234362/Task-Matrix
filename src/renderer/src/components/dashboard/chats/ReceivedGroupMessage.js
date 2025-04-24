// useGroupMessages.js

import { useEffect } from "react";
import socket from "../../../socket";

const useGroupMessages = (onGroupMessageReceived) => {
  useEffect(() => {
    const handleGroupMessage = (message) => {
      console.log("👥 Group message received:", message);

      if (message.isTagged) {
        console.log("🏷️ You were tagged in this message!");
      }

      onGroupMessageReceived(message);
    };

    socket.on("receiveGroupMessage", handleGroupMessage);

    return () => {
      socket.off("receiveGroupMessage", handleGroupMessage);
    };
  }, [onGroupMessageReceived]);
};

export default useGroupMessages;
