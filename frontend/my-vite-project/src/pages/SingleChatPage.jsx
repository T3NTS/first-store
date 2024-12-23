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
          <div className="bg-slate-950 w-2/5 h-full rounded-lg ">
            <div className="flex flex-col">
              <h1 className="text-gray-400 font-bold text-4xl p-4">Chat</h1>
              <hr className="border-gray-500"/>
            </div>
            <div className="flex gap-2 p-4 mt-2">
            <button onClick={() => changeButton('buy')} className={`rounded p-2 py-1 font-semibold transition ${buying ? 'bg-cyan-500 text-gray-200' : 'bg-slate-800 text-gray-400 hover:bg-cyan-500 hover:text-gray-200'}`}>
              I'm buying
            </button>
            <button onClick={() => changeButton('sell')} className={`rounded p-2 py-1 font-semibold transition ${selling ? 'bg-cyan-500 text-gray-200' : 'bg-slate-800 text-gray-400 hover:bg-cyan-500 hover:text-gray-200'}`}>
              I'm selling
            </button>
            </div>
            {chats &&
              <div className="flex w-full flex-col">
                <div className="border-gray-500 border-b w-full p-2 pl-4">
                  <h3 className="font-bold text-gray-400">READ</h3>
                </div>
                {buying ? chats.map((item) => {
                  if (item.buyerId._id === user.userId) {
                    return (
                      <Link to={`/user/${user.userId}/chat/${item.roomId}`}>
                        <ChatRoomCard key={item.roomId} item={item}/>
                      </Link>
                    )}
                  }) : chats.map((item) => {
                  if (item.sellerId._id === user.userId) {
                    return (
                      <Link to={`/user/${user.userId}/chat/${item.roomId}`}>
                        <ChatRoomCard key={item.roomId} item={item}/>
                      </Link>
                    )}
                  }
                )}
              </div>
            }
          </div>
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
                  className="w-full h-14 bg-slate-800 rounded-bl-lg p-4 outline-none text-gray-400"/>
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