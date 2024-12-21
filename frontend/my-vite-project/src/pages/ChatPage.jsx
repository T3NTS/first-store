import { useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import { IoMdSend } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { useWebSocketContext } from "../context/WebSocketContext";

const ChatPage = (props) => {
  const { user, setUser, cart } = props
  const [buying, setBuying] = useState(true)
  const [selling, setSelling] = useState(false)
  
  const socket = useWebSocketContext()
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
              <div className="flex w-full relative h-20 border-b border-gray-500 p-4 items-center gap-2">
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
            Click on a person to start chatting
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage