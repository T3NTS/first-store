import Navbar from "../components/Navbar"

const ChatPage = (props) => {
  const { user, setUser, cart } = props
  return (
    <div className="flex flex-col items-center min-h-screen h-screen bg-slate-900">
      <Navbar
        user={user}
        setUser={setUser}
        cart={cart}
      />
      <main className="flex flex-col mt-20 items-center p-8 h-full w-full px-8">
        <div className="bg-slate-950 w-full h-full rounded-lg">
          
        </div>
      </main>
    </div>
  )
}

export default ChatPage