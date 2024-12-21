import { useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import { IoMdSend } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SingleChatPage = (props) => {
  const { user, setUser, cart } = props
  const [buying, setBuying] = useState(true)
  const [selling, setSelling] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [messageDivs, setMessageDivs] = useState([

  ])
  const [roomId, setRoomId] = useState(null)
  const socket = useWebSocketContext()
  const location = useLocation()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [, , user1, , user2] = location.pathname.split('/')
        const res = await axios.get(`http://localhost:5000/api/v1/user/${user1}/chat/${user2}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(res.data)
        setMessages(res.data.messages)
      } catch(err) {
        console.log(err)
      }
    }
    fetchMessages()
  }, [location.pathname])

  useEffect(() => {
    if (socket) {
      const [, , user1, , user2] = location.pathname.split('/')
      console.log(socket, user1, user2)
      socket.emit('join_room', { user1, user2 })

      socket.on('joined_room', ({ roomId }) => {
        setRoomId(roomId)
      })

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
    console.log(socket)
    if (socket && user && roomId) {
      await socket.emit('send_message', { 
        message: inputValue,
        createdBy: user.userId,
        roomId: roomId
      })
      setMessages(prev => [...prev, {
        message: inputValue,
        createdAt: Date.now(),
        sender: user.userId
      }])
    }
  }

  const joinRoom = () => {
    
  }

  useEffect(() => {
    if (messages) {
      const newMessages = messages.map((item, i) => {
        const date = new Date(item.createdAt);
        const parsed = date.toLocaleString();
        const showTimestamp = i === messages.length - 1 ||
        new Date(messages[i].createdAt) - new Date(messages[i + 1]?.createdAt) < -60000
        return (
          <div key={item.createdAt} className={`flex flex-col mb-4 ${item.createdBy === user.userId ? 'items-end' : 'items-start' }`}>
          <div className={`flex items-center ${item.createdBy === user.userId ? 'bg-cyan-500' : 'bg-pink-500' } p-2 rounded text-gray-200 gap-2`}>
            <h3 className="text-left text-gray-700">{item.message}</h3>
            {item.createdBy === user.userId && 
              <CiCircleCheck className="h-5 w-5 text-gray-700"/>
            }
          </div>
          {showTimestamp &&
            <h5 className="text-gray-400 text-xs text-right mt-1">{parsed}</h5>
          }
        </div>
        )
      })
      setMessageDivs(newMessages)
    }
  }, [messages])

  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      <Navbar
        user={user}
        setUser={setUser}
        cart={cart}
      />
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
            <div className="flex w-full flex-col">
              <div className="border-gray-500 border-b w-full p-2 pl-4">
                <h3 className="font-bold text-gray-400">READ</h3>
              </div>
              <div 
                className="flex w-full relative h-20 border-b border-gray-500 p-4 items-center gap-2"
                onClick={() => joinRoom()}
              >
                <img className="rounded-full w-10 h-10" src='https://icon2.cleanpng.com/20180516/vgq/avrk6f9b5.webp'/>
                <div className="flex flex-col">
                  <h4 className="text-gray-400 m-0">Michael</h4>
                  <h5 className="text-gray-400 font-semibold m-0">Item name</h5>
                </div>
                <h4 className="absolute top-0 right-0 text-gray-400 m-4">15:43</h4>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-slate-950 w-full h-full rounded-lg">
            <div className="flex items-center w-full h-16 border-b border-gray-500 p-4">
              <img className="rounded-full w-8 h-8 mr-4" src='https://icon2.cleanpng.com/20180516/vgq/avrk6f9b5.webp'/>
              <h3 className="font-bold text-gray-400 text-lg">Michael</h3>
            </div>
            <div className="flex items-center w-full h-16 p-4">
              <img className="h-11 w-11 rounded mr-4 object-cover" src='https://www.stratstone.com/-/media/stratstone/blog/2024/top-10-best-supercars-of-2024/mclaren-750s-driving-dynamic-hero-1920x774px.ashx'/>
              <div className="flex flex-col">
                <h4 className="text-gray-400 m-0">Item name</h4>
                <h5 className="text-gray-400 font-bold m-0 text-sm">650 000</h5>
              </div>
            </div>
            <div className="flex-1 p-4">
              {messageDivs && messageDivs}
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
            
          </div>
        </div>
      </main>
    </div>
  )
}

export default SingleChatPage