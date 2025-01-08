import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"

const ChatHeader = (props) => {
  const { chats, roomId } = props
  const { user } = useContext(UserContext)
  const [chatInfo, setChatInfo] = useState(null)
  
  useEffect(() => {
    const correctChat = chats.find(item => item.roomId === roomId)
    setChatInfo(correctChat)
  }, [])
  if (chatInfo) {
    return (
      <>
        <div className="flex items-center w-full h-16 border-b border-gray-500 p-4">
          <img className="rounded-full w-8 h-8 mr-4" src='https://icon2.cleanpng.com/20180516/vgq/avrk6f9b5.webp'/>
          <h3 className="font-bold text-gray-400 text-lg">{user.userId === chatInfo.buyerId._id ? chatInfo.sellerId.name : chatInfo.buyerId.name}</h3>
        </div>
        <div className="flex items-center w-full h-16 p-4">
          <img className="h-11 w-11 rounded mr-4 object-cover" src={chatInfo.productId.imageURL}/>
          <div className="flex flex-col">
            <h4 className="text-gray-400 m-0">{chatInfo.productId.name}</h4>
            <h5 className="text-gray-400 font-bold m-0 text-sm">{chatInfo.productId.price}</h5>
          </div>
        </div>
      </>
    )
  }
}

export default ChatHeader