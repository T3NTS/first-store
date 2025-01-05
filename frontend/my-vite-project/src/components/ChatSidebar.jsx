import { Link } from "react-router-dom"
import ChatRoomCard from "./ChatRoomCard"
import { useLocation } from "react-router-dom"
import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"

const ChatSidebar = (props) => {
  const { changeButton, buying, chats, pageLocation, roomId } = props
  const { user } = useContext(UserContext)
  const location = useLocation()

  return (
    <div className="bg-slate-950 w-2/5 h-full rounded-lg ">
      <div className="flex flex-col">
        <h1 className="text-gray-400 font-bold text-4xl p-4">Chat</h1>
        <hr className="border-gray-500"/>
      </div>
      <div className="flex gap-2 p-4 mt-2">
      <button onClick={() => changeButton('buy')} className={`rounded p-2 py-1 font-semibold transition ${buying ? 'bg-cyan-500 text-gray-200' : 'bg-slate-800 text-gray-400 hover:bg-cyan-500 hover:text-gray-200'}`}>
        I'm buying
      </button>
      <button onClick={() => changeButton('sell')} className={`rounded p-2 py-1 font-semibold transition ${!buying ? 'bg-cyan-500 text-gray-200' : 'bg-slate-800 text-gray-400 hover:bg-cyan-500 hover:text-gray-200'}`}>
        I'm selling
      </button>
      </div>
      <div className="flex w-full flex-col">
        <div className="border-gray-500 border-b w-full p-2 pl-4">
          <h3 className="font-bold text-gray-400">READ</h3>
        </div>
        {buying ? chats.map((chat) => {
          if (chat.buyerId._id === user.userId) {
            return (
              <Link to={pageLocation === 'ChatPage' ? `${location.pathname}/${chat.roomId}` : `/user/${user.userId}/chat/${chat.roomId}`}>
                <ChatRoomCard key={chat.roomId} chat={chat} isActive={chat.roomId === roomId}/>
              </Link>
            )}
          }) : chats.map((chat) => {
          if (chat.sellerId._id === user.userId) {
            return (
              <Link key={chat.roomId} to={pageLocation === 'ChatPage' ? `${location.pathname}/${chat.roomId}` : `/user/${user.userId}/chat/${chat.roomId}`}>
                <ChatRoomCard chat={chat} isActive={chat.roomId === roomId}/>
              </Link>
            )}
          }
        )}
      </div>
    </div>
  )
}

export default ChatSidebar