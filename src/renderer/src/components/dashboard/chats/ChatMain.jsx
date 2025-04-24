
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Smile, Paperclip, Mic, Send } from "lucide-react"
import ChatHead from "./ChatHead"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import Button from "../../fields/Button"
import Input from "../../fields/Input"
import socket from "../../../socket"
import Service from "../../../api/configAPI"

const ChatMain = ({ contacts, conversations, handleSendMessage, setMessage, activeChat, setActiveChat }) => {
  const [recentChats, setRecentChats] = useState([])
  const activeContact = recentChats?.find(c => c.id === activeChat)
  const userInfo = useSelector((state) => state?.userData?.userData);
  const staffData = useSelector((state) => state?.userData?.staffData)
  const [currentConversation, setCurrentConversation] = useState()
  const groupID = activeChat?.group?.id
  const bottomRef = useRef(null)
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    getValues,
    formState: { errors },
  } = useForm();

  const handleMessage = async (data) => {
    const content = data.content
    const MessageData = { senderId: userInfo?.id, groupId: activeChat.group.id, content: content, taggedUserIds: [] }
    socket.emit("groupMessages", MessageData)

    setCurrentConversation((prev) => ({
      messages: [
        ...(prev?.messages || []),
        {
          id: `${Date.now()}`,
          text: content,
          time: new Date().toISOString(),
          sender: "me",
          senderName: null
        }
      ]
    }))
  }

  const fetchChatsByGroupID = async (groupID) => {
    try {
      const response = await Service.getChatByGroupId(groupID);
      if (response && response.length > 0) {
        const chatData = response.map((chat) => ({
          id: chat.id,
          text: chat.content,
          time: chat.createdAt,
          sender: chat.senderId === userInfo?.id ? "me" : "other",
          senderName: chat.senderId !== userInfo?.id ? `${chat.sender?.f_name} ${chat.sender?.l_name}` : null,
        }));
        setCurrentConversation({ messages: chatData });
        console.log("Fetched chats:", currentConversation);
      }
    } catch (error) {
      console.error("Error fetching chats by group ID:", error);
    }

  };

  useEffect(() => {
    if (activeChat) {
      fetchChatsByGroupID(groupID);
    }
  }, [activeChat]);

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      console.log("👥 Group message received:", msg);
      if (msg.groupId === activeChat?.group?.id) {
        const isSenderMe = msg.senderId === userInfo?.id;
        const newMessage = {
          id: msg.id,
          text: msg.content,
          time: msg.createdAt || new Date().toISOString(),
          sender: isSenderMe ? "me" : "other",
          senderName: (() => {
            const sender = staffData?.find(staff => staff.id === msg.senderId);
            return sender ? `${sender.f_name} ${sender.l_name}` : "Unknown Sender";
          })()
        };

        setCurrentConversation(prev => ({
          messages: [...(prev?.messages || []), newMessage]
        }));
      }

      if (msg.isTagged) {
        console.log("🏷️ You were tagged!");
      }
    };

    socket.on("receiveGroupMessage", handleIncomingMessage);

    return () => {
      socket.off("receiveGroupMessage", handleIncomingMessage);
    };
  }, [activeChat?.group?.id, userInfo?.id]);
  useEffect(() => {
    const handleGroupMessage = (msg) => {
      if (!socket || !socket.connected) {
        console.log("Socket not connected")
        return;
      };

      console.log("👥 Group message received:", msg)

      // Update last message in recent chat list
      setRecentChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.group.id === msg.groupId) {
            return {
              ...chat,
              lastMessage: msg.content,
              updatedAt: msg.createdAt,
            }
          }
          return chat
        })
      })

      if (msg.isTagged) {
        console.log("🏷️ You were tagged!")
        // Optionally: toast.info("You were tagged in a message.")
      }
    }

    socket.on("receiveGroupMessage", handleGroupMessage)

    return () => {
      socket.off("receiveGroupMessage", handleGroupMessage)
    }
  }, [socket])
  console.log("RecentChats:", recentChats)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-center p-6 max-w-md">
          <img
            src="/placeholder.svg?height=200&width=200"
            alt="Start chatting"
            className="w-48 h-48 mx-auto mb-6 opacity-50"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Chats</h2>
          <p className="text-gray-500">
            Select a contact from the sidebar to start chatting or search for someone specific.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      <ChatHead contact={activeChat} onBack={() => setActiveChat?.(null)} />

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {[...(currentConversation?.messages || [])]
            .sort((a, b) => new Date(a.time) - new Date(b.time))
            .map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                {/* {console.log(msg)} */}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === "me" ? "bg-green-100 rounded-tr-none" : "bg-orange-200 rounded-tl-none"}`}
                >
                  {msg.sender !== "me" && msg.senderName && (
                    <p className="text-xs text-gray-600 font-semibold mb-1">{msg.senderName}</p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {new Date(msg.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Message input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit(handleMessage)} className="flex items-center space-x-2">
          <Input
            type="text"
            {...register("content")}
            placeholder="Type a message"
            className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <Button size="icon" type="submit" className="text-green-500">
            <Send size={24} />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatMain
