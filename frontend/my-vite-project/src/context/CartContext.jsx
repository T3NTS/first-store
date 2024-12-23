import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const CartContext = createContext()

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const res = await axios.get(`http://localhost:5000/api/v1/users/${user.userId}/cart`, {
            headers: { Authorization: `Bearer ${token}`}
          })
          localStorage.setItem('cart', JSON.stringify(res.data))
          setCart(res.data)
        }
      } catch(err) {
        console.log(err)
      }
    }
    if (!cart && user) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [user])
  return (
    <CartContext.Provider value={({ cart, setCart })}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext, CartProvider }