/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Search, MoreVertical } from "lucide-react"
import Button from "../../fields/Button"
import { useState } from "react"
import GroupDetail from "./GroupDetail"

const ChatHead = ({ contact, onBack }) => {
  console.log("Contact in ChatHead:", contact)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const group = contact?.group
  
  const handleViewGroupDetails = (group) => {
    console.log("Group in handleViewGroupDetails:", group)
    setSelectedGroup(group)
    setIsModalOpen(true)
  }
console.log("Selected group in ChatHead:", selectedGroup)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGroup(null)
  }

  return (
    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div className="flex items-center">
        {onBack && (
          <button onClick={onBack} className="md:hidden mr-3 text-sm text-blue-500">
            ← Back
          </button>
        )}
        <div className="ml-3">
          <h2 className="font-semibold">{contact?.group?.name}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search size={20} />
        </Button>
        <Button onClick={()=> handleViewGroupDetails(contact.group)} variant="ghost" size="icon" className="rounded-full">
          <MoreVertical size={20} />
        </Button>
      </div>
      {selectedGroup && (
        <GroupDetail
        group={selectedGroup}
        onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default ChatHead
