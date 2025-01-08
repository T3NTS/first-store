import { useContext, useEffect, useState, useRef, useCallback } from "react"
import Navbar from "../components/Navbar"
import { IoMdSend } from "react-icons/io";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ChatHeader from "../components/ChatHeader";
import Messages from "../components/Messages";
import { UserContext } from "../context/UserContext";
import ChatSidebar from "../components/ChatSidebar";
import ScrollableFeed from 'react-scrollable-feed'

const SingleChatPage = () => {
  const { user } = useContext(UserContext)
  const [buying, setBuying] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState(null)
  const socket = useWebSocketContext()
  const location = useLocation()
  const roomId = location.pathname.split('/')[4]
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isVisible, setIsVisible] = useState(null)
  const observer = useRef(null)

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get(`http://localhost:5000/api/v1/chat/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log('chats:', res.data);
      setChats(res.data);
    }
    if (user) {
    fetchChats()
    }
  }, [user])

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('fetching messages')
      try {
          const res = await axios.get(`http://localhost:5000/api/v1/chat/${user.userId}/${roomId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: {
              limit: 20,
              beforeMessageId: ''
            }
          })
          console.log('messages:', res.data)
          setMessages(res.data.messages);
          const currentChat = chats.find(chat => chat.roomId === roomId)
          setBuying(currentChat.buyerId._id === user.userId)
          setLoading(false)
      }
      catch(err){
        console.log(err)
        setLoading(false)
      }
    }
    if (user && chats) {
      fetchMessages()
    }
  }, [location.pathname, user, chats])

  useEffect(() => {
    if (socket) {
      const handleMessage = (message) => {
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
        socket.off('messages_seen', handleMessagesSeen)
      }
    }
  }, [socket, chats])

  useEffect(() => {
    if (!hasMore) setHasMore(true)
  }, [location.pathname])

  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/chat/${user.userId}/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            flag: messages[0]
          }
        })
        setTimeout(() => {
          if (res.data.messages.length < 20) setHasMore(false)
            if (res.data.messages.length > 0) {
              setMessages(prev => [...res.data.messages, ...prev])
            }
        }, 500)
        
      } catch (err) {
        console.log(err)
      }
    }
    console.log(hasMore)
    if (messages.length >= 20 && hasMore && isVisible && !loading) {
      fetchOldMessages()
    }
  }, [isVisible])

  useEffect(() => {
    if (socket) {
      //its alone cause then chats wont rerender if new msg are sent
      socket.emit('join_room', { roomId, userId: user.userId })
    }
  }, [socket])

  const lastMessage = useCallback((node) => {
    if (!node) return
    if (loading) return
    if (observer.current) console.log(observer.current), observer.current.disconnect()
    const scrollableElement = document.querySelector('.scrollableFeed')
    observer.current = new IntersectionObserver((entries) => {
      console.log(entries[0])
      console.log('scrollref:', scrollableElement)
      setIsVisible(entries[0].isIntersecting)
    }, { root: scrollableElement, rootMargin: '600px' })
    observer.current.observe(node)
  }, [messages, isVisible])

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
  //do skeleteons later or reload wehleel
  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      <Navbar/>
      <main className="flex flex-col mt-20 items-center p-8 h-full w-full px-48">
        <div className="flex h-full w-full gap-4">
          { chats &&
            <ChatSidebar
              key={roomId}
              changeButton={changeButton}
              buying={buying}
              chats={chats}
              pageLocation='SingleChatPage'
              roomId={roomId}
            />
          }
          <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
            {loading ? (
              <div className="text-4xl text-white">Loading...</div>
            ) : (
              <>
                <ChatHeader key={roomId} chats={chats} roomId={roomId}/>
                <div></div>
                <div className="h-[625px]">
                  <ScrollableFeed className={`scrollableFeed flex-1 p-4 flex-col-reverse overflow-hidden`}>
                    {messages &&
                      <Messages 
                        messages={messages} 
                        lastMessage={lastMessage}/>
                      }
                  </ScrollableFeed>
                </div>
                <div className="flex">
                <input
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write a message..." 
                  className="w-full h-14 bg-slate-800 rounded-bl-lg p-4 outline-none text-gray-400"
                  value={inputValue}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SingleChatPage