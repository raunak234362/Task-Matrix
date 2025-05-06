/* eslint-disable prettier/prettier */
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

const ChatMain = ({ activeChat, setActiveChat }) => {
  const [recentChats, setRecentChats] = useState([])
  const activeContact = recentChats?.find(c => c.id === activeChat)
  const userInfo = useSelector((state) => state?.userData?.userData);
  const staffData = useSelector((state) => state?.userData?.staffData)
  const [currentConversation, setCurrentConversation] = useState()
  const groupID = activeChat?.group?.id
  const bottomRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const [oldestMessageId, setOldestMessageId] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    getValues,
    formState: { errors },
  } = useForm()

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

  const fetchChatsByGroupID = async (groupID, lastMsgId = null) => {
    try {
      const container = scrollContainerRef.current
      const prevScrollHeight = container?.scrollHeight

      setIsLoading(true)
      const response = await Service.getChatByGroupId(groupID, lastMsgId)
      if (response) {
        const chatData = response.map((chat) => ({
          id: chat.id,
          text: chat.content,
          time: chat.createdAt,
          sender: chat.senderId === userInfo?.id ? "me" : "other",
          senderName: chat.senderId !== userInfo?.id ? `${chat.sender?.f_name} ${chat.sender?.l_name}` : null,
        }))

        if (chatData.length > 0) {
          setCurrentConversation((prev) => ({
            messages: [...chatData, ...(prev?.messages || [])],
          }))
          setOldestMessageId(chatData[0].id)
        }

        if (chatData.length < 20) {
          setHasMore(false)
        }

        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight
            container.scrollTop = newScrollHeight - prevScrollHeight
          }
        }, 100)
      }
    } catch (error) {
      console.error("Error fetching chats by group ID:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (container && container.scrollTop === 0 && hasMore && !isLoading) {
      fetchChatsByGroupID(groupID, oldestMessageId)
    }
  }

  useEffect(() => {
    if (activeChat) {
      setOldestMessageId(null) // reset
      setHasMore(true) // reset
      setCurrentConversation({ messages: [] }) // clear current messages
      fetchChatsByGroupID(groupID, null)
    }
  }, [activeChat])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [oldestMessageId, hasMore, isLoading])

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      if (msg.groupId === activeChat?.group?.id) {
        const isSenderMe = msg.senderId === userInfo?.id
        const newMessage = {
          id: msg.id,
          text: msg.content,
          time: msg.createdAt || new Date().toISOString(),
          sender: isSenderMe ? "me" : "other",
          senderName: (() => {
            const sender = staffData?.find(staff => staff.id === msg.senderId)
            return sender ? `${sender.f_name} ${sender.l_name}` : "Unknown Sender"
          })()
        }

        setCurrentConversation(prev => ({
          messages: [...(prev?.messages || []), newMessage]
        }))
      }
    }

    socket.on("receiveGroupMessage", handleIncomingMessage)

    return () => {
      socket.off("receiveGroupMessage", handleIncomingMessage)
    }
  }, [activeChat?.group?.id, userInfo?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

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
    <div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <ChatHead contact={activeChat} onBack={() => setActiveChat?.(null)} />
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={scrollContainerRef}>
        <div className="space-y-4">
          {isLoading && <div className="text-center text-gray-500 text-sm">Loading more...</div>}
          {[...(currentConversation?.messages || [])]
            .sort((a, b) => new Date(a.time) - new Date(b.time))
            .map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === "me" ? "bg-green-100 rounded-tr-none" : "bg-orange-200 rounded-tl-none"
                    }`}
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

      {/* Sticky Input */}
      <div className="sticky bottom-0 z-0 bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSubmit(handleMessage)} className="flex items-center space-x-2">
          <Input
            type="text"
            label="Type a message"
            {...register("content")}
            placeholder="Type a message"
            className="flex-1 "
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
