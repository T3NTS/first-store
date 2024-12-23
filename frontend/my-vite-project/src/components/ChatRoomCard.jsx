import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const ChatRoomCard = (props) => {
  const { item } = props
  const { user } = useContext(UserContext)
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
      <img className="rounded-full w-10 h-10 object-cover" src={item.productId.imageURL}/>
      <div className="flex flex-col">
        <h4 className="text-gray-400 m-0">{user.userId === item.buyerId._id ? item.sellerId.name : item.buyerId.name}</h4>
        <h4 className="text-gray-400 font-bold m-0">{item.productId.name}</h4>
        <h4 className="text-gray-400 m-0">{item.lastMessage}</h4>
      </div>
      <h4 className="absolute top-0 right-0 text-gray-400 m-4">{getCorrectTime(item.lastMessageAt)}</h4>
    </div>
  )
}

export default ChatRoomCard