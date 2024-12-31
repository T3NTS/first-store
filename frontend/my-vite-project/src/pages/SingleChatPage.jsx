import { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { IoMdSend } from "react-icons/io";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ChatHeader from "../components/ChatHeader";
import Messages from "../components/Messages";
import { UserContext } from "../context/UserContext";
import ChatSidebar from "../components/ChatSidebar";

const SingleChatPage = () => {
  const { user } = useContext(UserContext)
  const [buying, setBuying] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState(null)
  const socket = useWebSocketContext()
  const location = useLocation()
  const roomId = location.pathname.split('/')[4]

  useEffect(() => {
    //maybe theres an issue because you can use roomid from room.roomid but 
    //could be issue with fetching timing etc
    const fetchData = async () => {
      console.log('fetching messages')
      try {
        const [messagesRes, chatsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/chat/${user.userId}/${roomId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`http://localhost:5000/api/v1/chat/${user.userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ])
        console.log('chats:', chatsRes.data);
        console.log('messages:', messagesRes.data);
        setChats(chatsRes.data);
        setMessages(messagesRes.data.messages);
      }
      catch(err){
        console.log(err)
      }
    }
    if (user) {
      fetchData()
    }
  }, [location.pathname, user])

  useEffect(() => {
    if (socket) {
      const handleMessage = (message) => {
        //maybe problem that user2 still has unseen that msg but idk
        if (message.createdBy !== user.userId) {
          socket.emit('message_seen_live', { ...message, seen: true })
        }
          setMessages(prev => [...prev, message])
          if (chats) {
            setChats(prev => prev.map((chat) => {
              return chat.roomId === message.roomId ? {
                ...chat,
                lastMessageId: { ...message }
              } : chat
            }))
          }
        
      }

      const handleMessagesSeen = () => {
        console.log('updating seen')
        setChats(prev => prev.map((chat) => {
          return chat.roomId === roomId ? {
            ...chat,
            lastMessageId: { ...chat.lastMessageId, seen: true }
          } : chat
        }))
        setMessages(prev => prev.map((message) => {
          return !message.seen ? {
            ...message,
            seen: true
          } : message
        }))
      }

      socket.on('messages_seen', handleMessagesSeen)
      socket.on('receive_message', handleMessage)
      return () => {
        socket.off('receive_message', handleMessage)
      }
    }
  }, [socket, chats])

  useEffect(() => {
    if (socket) {
      //its alone cause then chats wont rerender if new msg are sent
      socket.emit('join_room', { roomId, userId: user.userId })
    }
  }, [socket])

  const changeButton = (button) => {
    if (button === 'buy' && !buying) {
      setBuying(true)
    }
    if (button === 'sell' && buying) {
      setBuying(false)
    }
  }

  const sendMessage = async () => {
    setInputValue('')
    if (socket && user) {
      console.log('emit messages')
      await socket.emit('send_message', { 
        message: inputValue,
        createdBy: user.userId,
        createdAt: Date.now(),
        roomId
      })
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      <Navbar/>
      <main className="flex flex-col mt-20 items-center p-8 h-full w-full px-48">
        <div className="flex h-full w-full gap-4">
          {chats &&
            <ChatSidebar
              key={chats}
              changeButton={changeButton}
              buying={buying}
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
                    <Messages messages={messages}/>
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