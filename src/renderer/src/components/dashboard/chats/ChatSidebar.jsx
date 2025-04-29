/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Search, MoreVertical } from "lucide-react"
import { useState } from "react"
import AddGroupModal from "./AddGroupModal"
import { MdGroupAdd } from "react-icons/md"
import { TiUserAdd } from "react-icons/ti";
import Button from "../../fields/Button";
const ChatSidebar = ({ activeChat, recentChats, setActiveChat }) => {
  // const [activeChat, setActiveChat] = useState(0)
  const userType = sessionStorage.getItem("userType");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivateChatOpen, setIsPrivateChatOpen] = useState(false);
  
  const handleAddGroupView = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handlePrivateChat = () => {
    setIsPrivateChatOpen(true)
  }
  const handleClosePrivateChat = () => {
    setIsPrivateChatOpen(false)
  }


  return (
    <div className="flex flex-col justify-between h-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Sidebar with contacts */}
      <div className="w-full border-r border-gray-200 bg-white">
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            {/* <img src="/placeholder.svg?height=40&width=40" alt="Your avatar" className="w-10 h-10 rounded-full" /> */}
            <h2 className="ml-3 font-semibold">Chats</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-green-500">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search or start new chat"
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="overflow-y-auto h-[calc(82vh-132px)]">
          {recentChats?.map((chats) => (
            <div
              key={chats.id}
              className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === chats?.group?.id ? "bg-gray-100" : ""}`}
              onClick={() => setActiveChat(chats)}  // <-- This triggers ChatMain to open
            >
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{chats?.group?.name}</h3>
                  <span className="text-xs text-gray-500">{chats.timestamp}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate w-40">{chats.lastMessage}</p>
                  {chats.unread > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chats.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add group button */}
      <div className="p-4 sticky flex bottom-0 justify-between border-t border-gray-200 bg-white items-center">

{/* 
        <Button variant="outline" size="xs" onClick={handlePrivateChat}>
          <TiUserAdd />

        </Button> */}
        {userType !== "user" ? (

        <Button variant="outline" size="sm" onClick={handleAddGroupView}>
          <MdGroupAdd />
        </Button>
        ) : null}
      </div>
      {/* Modal for adding group */}
      {isModalOpen && (
        <AddGroupModal
          onClose={handleCloseModal}
        />
      )}


      {isPrivateChatOpen && (
        <AddGroupModal
          onClose={handleClosePrivateChat}
        />
      )}
    </div>
  )
}

export default ChatSidebar

