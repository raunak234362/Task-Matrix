/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ChatSidebar from "./ChatSidebar"
import ChatMain from "./ChatMain"
import useGroupMessages from "./ReceivedGroupMessage"
import Service from "../../api/configAPI"
import socket from "../../socket"

const Chats = () => {
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState(null)
  const [recentChats, setRecentChats] = useState([])
  const [unreadChatIds, setUnreadChatIds] = useState([]);
  const fetchAllRecentConversations = async () => {
    try {
      const response = await Service.getAllChats()
      console.log("Conversations:", response)
      setRecentChats(response.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  useGroupMessages((newMessage) => {
    setMessage((prev) => [...prev, newMessage]);
  });


  // 🔄 Fetch conversations once
  useEffect(() => {
    fetchAllRecentConversations()
  }, [])

  // 📡 Real-time listener for group messages
  useEffect(() => {
    const handleGroupMessage = (msg) => {
      console.log("👥 Group message received:", msg)

      // Update last message in recent chat list
      setRecentChats((prevChats) => {
        let updatedChats = prevChats.map((chat) => {
          if (chat.group.id === msg.groupId) {
            return {
              ...chat,
              lastMessage: msg.content,
              updatedAt: msg.createdAt,
            }
          }
          return chat
        })

        // Find the updated chat
        const updatedChat = updatedChats.find((chat) => chat.group.id === msg.groupId)

        // Filter out the updated chat from list and unshift it to the top
        updatedChats = [
          updatedChat,
          ...updatedChats.filter((chat) => chat.group.id !== msg.groupId),
        ]

        return updatedChats
      })

      if (msg.isTagged) {
        console.log("🏷️ You were tagged!")
        // Optionally: toast.info("You were tagged in a message.")
      }
    }

    socket.on("receiveGroupMessage", (msg) => {
      if (msg.groupId !== activeChat?.group?.id) {
        setUnreadChatIds(prev => prev.includes(msg.groupId) ? prev : [...prev, msg.groupId]);
      }
    });

    socket.on("receiveGroupMessage", handleGroupMessage)

    return () => {
      socket.off("receiveGroupMessage", handleGroupMessage)
    }
  }, [])


  return (
     <div className="w-full h-screen flex overflow-hidden bg-white rounded-md shadow-lg relative">

      {/* Desktop View: Sidebar + Chat */}
      <div className="hidden md:flex w-full h-full">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r">
          <ChatSidebar
            activeChat={activeChat}
            recentChats={recentChats}
            unreadChatIds={unreadChatIds}
            setUnreadChatIds={setUnreadChatIds}
            setActiveChat={setActiveChat}
          />
        </div>
        <div className="w-2/3 lg:w-3/4">
          <ChatMain
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            recentChats={recentChats}
            setMessage={setMessage}
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden w-full h-full">
        {!activeChat ? (
          <ChatSidebar
            activeChat={activeChat}
            recentChats={recentChats}
            unreadChatIds={unreadChatIds}
            setUnreadChatIds={setUnreadChatIds}
            setActiveChat={setActiveChat}
          />
        ) : (
          <ChatMain
            recentChats={recentChats}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            setMessage={setMessage}
          />
        )}
      </div>
    </div>
  )
}

export default Chats
