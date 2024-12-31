import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { IoMdCheckmarkCircle } from "react-icons/io";

const ChatRoomCard = (props) => {
  const { chat } = props
  const { lastMessageId } = chat
  const { user } = useContext(UserContext)
  //const { socket } = useContext(WebSocketContext)
/*
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {

      })
    }
  }, [socket])*/

  const getCorrectTime = (time) => {
    const date = new Date(time)
    const dateNow = Date.now()
    if (dateNow - date >= 86400000) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
    } else {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  return (
    <div className="flex w-full relative h-20 border-b border-gray-500 p-4 items-center gap-2">
      <img className="rounded-full w-10 h-10 object-cover" src={chat.productId.imageURL}/>
      <div className="flex flex-col">
        <h4 className="text-gray-400 m-0">{user.userId === chat.buyerId._id ? chat.sellerId.name : chat.buyerId.name}</h4>
        <h4 className="text-gray-400 font-bold m-0">{chat.productId.name}</h4>
        <div className="flex gap-1 items-center">
          {lastMessageId.createdBy === user.userId &&
            <IoMdCheckmarkCircle className={`h-4 w-4 ${lastMessageId.seen ? 'text-cyan-700' : 'text-gray-800'}`}/>
          }
          <h4 className="text-gray-400 m-0">{lastMessageId.message}</h4>
        </div>
      </div>
      <h4 className="absolute top-0 right-0 text-gray-400 m-4">{getCorrectTime(lastMessageId.createdAt)}</h4>
    </div>
  )
}

export default ChatRoomCard