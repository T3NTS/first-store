import { useContext, useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import { IoMdSend } from "react-icons/io";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ChatRoomCard from "../components/ChatRoomCard";
import ChatHeader from "../components/ChatHeader";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ChatSidebar from "../components/ChatSidebar";

const SingleChatPage = (props) => {
  const { user } = useContext(UserContext)
  const [buying, setBuying] = useState(true)
  const [selling, setSelling] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState(null)
  const socket = useWebSocketContext()
  const location = useLocation()
  const roomId = location.pathname.split('/')[4]

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('fetching messages')
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/chat/${user.userId}/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log('messages:', res.data)
        setMessages(res.data.messages)
      } catch(err) {
        console.log(err)
      }
    }
    const fetchChats = async () => {
      console.log('fetching chats')
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
    if (user) {
      fetchChats()
      fetchMessages()
    }
  }, [location.pathname, user])

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', { roomId },)
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data])
      })
    }
  }, [socket])

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

  const sendMessage = async () => {
    setInputValue('')
    if (socket && user) {
      const roomId = location.pathname.split('/')[4]
      await socket.emit('send_message', { 
        message: inputValue,
        createdBy: user.userId,
        createdAt: Date.now(),
        roomId
      })
      //A bit risky setting the new message instanylt witho going to bakcned
      setMessages(prev => [...prev, {
        message: inputValue,
        createdAt: Date.now(),
        createdBy: user.userId,
        roomId
      }])
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      <Navbar/>
      <main className="flex flex-col mt-20 items-center p-8 h-full w-full px-48">
        <div className="flex h-full w-full gap-4">
          {chats &&
            <ChatSidebar
              changeButton={changeButton}
              buying={buying}
              selling={selling}
              chats={chats}
              pageLocation='SingleChatPage'
            />
          }
          <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
            {chats &&
              <>
                <ChatHeader key={roomId} chats={chats} roomId={roomId}/>
                <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '625px' }}>
                  {messages &&
                    messages.map((item, i) => {
                      const date = new Date(item.createdAt)
                      const parsed = date.toLocaleString()
                      const showTimestamp = i === messages.length - 1 ||
                      new Date(messages[i].createdAt) - new Date(messages[i + 1]?.createdAt) < -60000
                      return (
                      <MessageBox
                        key={item.createdAt}
                        item={item} 
                        parsed={parsed}
                        showTimestamp={showTimestamp}
                      />
                    )})
                  }
                </div>
                <div className="flex">
                <input
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write a message..." 
                  className="w-full h-14 bg-slate-800 rounded-bl-lg p-4 outline-none text-gray-400"
                  value={inputValue}  
                />
                <div className="flex items-center h-14 w-14 bg-slate-800 rounded-br-lg">
                {inputValue &&
                  <IoMdSend 
                    className="text-gray-400 h-full w-full px-4 hover:cursor-pointer z-4"
                    onClick={sendMessage}
                  />}
                </div>
                </div>
              </>
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default SingleChatPage