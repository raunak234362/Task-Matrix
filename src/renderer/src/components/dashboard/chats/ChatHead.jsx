/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Search, MoreVertical } from "lucide-react"
import Button from "../../fields/Button"

const ChatHead = ({ contact, onBack }) => {
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
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical size={20} />
        </Button>
      </div>
    </div>
  )
}

export default ChatHead
