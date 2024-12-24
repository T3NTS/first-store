import { useContext, useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import axios from "axios";
import ChatSidebar from "../components/ChatSidebar";
import { UserContext } from "../context/UserContext";

const ChatPage = () => {
  const { user } = useContext(UserContext)
  const [buying, setBuying] = useState(true)
  const [selling, setSelling] = useState(false)
  const [chats, setChats] = useState(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/chat/${user.userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log('chats:', res.data)
        setChats(res.data)
      } catch(err) {
        console.log(err)
      }
    }
    fetchChats()
  }, [user])

  const changeButton = (button) => {
    if (button === 'buy' && !buying) {
      setBuying(true)
      setSelling(false)
    }
    if (button === 'sell' && !selling) {
      setBuying(false)
      setSelling(true)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      {user &&
        <Navbar/>
      }
      <main className="flex flex-col mt-20 items-center p-8 h-full w-full px-48">
        {chats &&
        <div className="flex h-full w-full gap-4">
          <ChatSidebar 
            changeButton={changeButton} 
            buying={buying} 
            selling={selling}
            chats={chats}
            pageLocation='ChatPage'
          />
          <div className="flex justify-center items-center font-bold text-3xl flex-col bg-slate-950 w-full h-full rounded-lg text-gray-400">
            Click on a person to start chatting
          </div>
        </div>
        }
      </main>
    </div>
  )
}

export default ChatPage