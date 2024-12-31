import { useContext } from "react"
import { CiCircleCheck } from "react-icons/ci"
import { UserContext } from "../context/UserContext"
import { IoIosCheckmark } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";


const MessageBox = (props) => {
  const { item, parsed, showTimestamp } = props
  const { user } = useContext(UserContext)
  return (
    <div className={`flex flex-col mb-4 ${item.createdBy === user.userId ? 'items-end' : 'items-start' }`}>
      <div className={`flex items-center ${item.createdBy === user.userId ? 'bg-cyan-500' : 'bg-pink-500' } p-2 rounded text-gray-200 gap-2`}>
        <h3 className="text-left text-gray-700">{item.message}</h3>
        {item.createdBy === user.userId && 
          <IoMdCheckmarkCircle className={`h-5 w-5 ${item.seen ? 'text-cyan-700' : 'text-gray-800'}`}/>
        }
      </div>
      {showTimestamp &&
        <h5 className="text-gray-400 text-xs text-right mt-1">{parsed}</h5>
      }
    </div>
  )
}

export default MessageBox