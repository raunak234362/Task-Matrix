/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Smile, Paperclip, Mic, Send } from "lucide-react"
import ChatHead from "./ChatHead"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import Button from "../fields/Button"
import Input from "../fields/Input"
import socket from "../../socket"
import Service from "../../api/configAPI"
import ChatBG from "../../assets/CHATBG.webp"

const ChatMain = ({ activeChat, setActiveChat }) => {
  const [recentChats, setRecentChats] = useState([])
  const activeContact = recentChats?.find(c => c.id === activeChat)
  const userInfo = useSelector((state) => state?.userData?.userData)
  const staffData = useSelector((state) => state?.userData?.staffData)
  const [currentConversation, setCurrentConversation] = useState()
  const groupID = activeChat?.group?.id
  const bottomRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const [oldestMessageId, setOldestMessageId] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isLiveMessage, setIsLiveMessage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const handleMessage = async () => {
    const content = inputValue.trim()
    if (!content) return
    const MessageData = { senderId: userInfo?.id, groupId: activeChat.group.id, content, taggedUserIds: [] }
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
    setInputValue("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleMessage()
    }
  }

  const formatMessage = (text) => {
    const words = text?.split(" ")
    let lines = []
    let currentLine = []

    words?.forEach(word => {
      currentLine?.push(word)
      if (currentLine?.length >= 20) {
        lines?.push(currentLine?.join(" "))
        currentLine = []
      }
    })
    if (currentLine?.length) lines?.push(currentLine?.join(" "))

    return lines.map((line, idx) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return <li key={idx} className="list-disc ml-4">{line.trim().slice(2)}</li>
      }
      return (<p key={idx}>
        {line.split(" ").map((word, wIdx) => {
          if (word.startsWith("@") && word.length > 1) {
            return (
              <span key={wIdx} className="text-blue-500 font-semibold">
                {word}{" "}
              </span>
            )
          }
          return word + " "
        })}
      </p>)
    })
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
          const reversedChatData = chatData.reverse()
          setCurrentConversation((prev) => {
            const existingIds = new Set(prev?.messages.map(m => m.id))
            const newMessages = reversedChatData.filter(m => !existingIds.has(m.id))
            return {
              messages: [...newMessages, ...(prev?.messages || [])],
            }
          })

          setOldestMessageId(reversedChatData[0].id)
        }

        if (chatData.length < 20) setHasMore(false)
        if (lastMsgId) {
          setIsPaginating(true);
          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - prevScrollHeight;
            }
            setIsPaginating(false);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error fetching chats by group ID:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeChat) {
      setOldestMessageId(null)
      setHasMore(true)
      setCurrentConversation({ messages: [] })
      setIsFirstLoad(true)
      fetchChatsByGroupID(groupID, null)
    }
  }, [activeChat])

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      if (msg.groupId === activeChat?.group?.id) {
        setIsLiveMessage(true);  // << ADD THIS

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
    };


    socket.on("receiveGroupMessage", handleIncomingMessage)
    return () => socket.off("receiveGroupMessage", handleIncomingMessage)
  }, [activeChat?.group?.id, userInfo?.id])

  useEffect(() => {
    if (isFirstLoad && currentConversation?.messages?.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      setIsFirstLoad(false);
    } else if (isLiveMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLiveMessage(false);
    }
    // IMPORTANT: Do NOT scroll on pagination
  }, [currentConversation?.messages, isFirstLoad, isLiveMessage]);

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop < 100 && hasMore && !isLoading) {
        fetchChatsByGroupID(groupID, oldestMessageId)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [groupID, oldestMessageId, hasMore, isLoading])

  return (
    <div className="flex flex-col w-full h-full overflow-hidden" style={{ backgroundImage: `url(${ChatBG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <ChatHead contact={activeChat} onBack={() => setActiveChat?.(null)} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-green-50/60" ref={scrollContainerRef}>
        <div className="space-y-4">
          {isLoading && <div className="text-center text-gray-500 text-sm">Loading more...</div>}
          {(() => {
            let lastMessageDate = null
            return (currentConversation?.messages || [])
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((msg) => {
                const messageDate = new Date(msg.time).toDateString()
                let showDateLabel = false

                if (lastMessageDate !== messageDate) {
                  lastMessageDate = messageDate
                  showDateLabel = true
                }

                const today = new Date()
                const yesterday = new Date()
                yesterday.setDate(today.getDate() - 1)
                const formattedDate =
                  messageDate === today.toDateString()
                    ? "Today"
                    : messageDate === yesterday.toDateString()
                      ? "Yesterday"
                      : new Date(msg.time).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })

                return (
                  <div key={msg.id}>
                    {showDateLabel && (
                      <div className="flex justify-center mb-2">
                        <span className="bg-gray-300 text-gray-700 text-xs py-1 px-3 rounded-full">
                          {formattedDate}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} mb-1`}>
                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === "me"
                          ? "bg-white/70 rounded-tr-none"
                          : "bg-teal-100/80 rounded-tl-none"
                          }`}
                      >
                        {msg.sender !== "me" && msg.senderName && (
                          <p className="text-xs text-gray-600 font-semibold mb-1">
                            {msg.senderName}
                          </p>
                        )}
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {formatMessage(msg.text)}
                        </div>
                        <p className="text-right text-xs text-gray-800 mt-1">
                          {new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
          })()}
          <div ref={bottomRef}></div>
        </div>
      </div>

      <div className="sticky bottom-0 z-0 bg-white border-t border-gray-200 p-3">
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2 w-full">
          <textarea
            rows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message (Shift + Enter for newline)"
            className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
          />
          <Button size="icon" onClick={handleMessage} className="text-green-500">
            <Send size={24} />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatMain
