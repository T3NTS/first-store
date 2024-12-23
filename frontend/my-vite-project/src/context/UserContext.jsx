import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      console.log('fetching user')
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const res = await axios.get('http://localhost:5000/api/v1/users', {
            headers: { Authorization: `Bearer ${token}`}
          })
          console.log(res.data)
          setUser(res.data)
        }
      } catch(err) {
        console.log(err)
      }
    }
    if (!user) {
      fetchUser()
    }
  }, [user])
  return (
    <UserContext.Provider value={({ user, setUser })}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }