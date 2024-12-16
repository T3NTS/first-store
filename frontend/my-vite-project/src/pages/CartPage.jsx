import {React, useEffect, useState, useRef} from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";


const CartPage = (props) => {
  const { user, setUser, cart, setCart } = props
  const [isLoading, setIsLoading] = useState(true)
  const isInitialMount = useRef(true)
  const location = useLocation()
  const [cartInfo, setCartInfo] = useState(null)

  const fetchProducts = async () => {
    const cartItems = cart.items.map(item => ({
      id: item.productId,
      quantity: item.quantity
    }))
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/protected/products/batch`, { cartItems }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setCartInfo(res.data)
      setIsLoading(false)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      fetchProducts()
      isInitialMount.current = false
    }
  }, [])

  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart])

  const updateCart = async (cartProduct) => {
    const url = location.pathname.split('/').slice(-2).join('/')
    try {
      const res = await axios.patch(`http://localhost:5000/api/v1/users/${url}`, cartProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCart(res.data)
      localStorage.setItem('cart', JSON.stringify(res.data))
    } catch(err) {
      console.log(err)
    }
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen h-cover bg-slate-900">
      <Navbar
        user={user}
        setUser={setUser}
        cart={cart}
      />
      <main className="flex flex-col mt-20 items-center p-8 w-full px-8">
        <div className="bg-slate-950 w-full rounded-lg">
          <h1 className="text-gray-400 text-2xl p-4 font-bold text-center mb-8">{`Your Cart (${cart.items.length} items)`}</h1>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] pl-12">
            <div></div>
            <div className="flex text-gray-400 text-xl font-semibold">
              Name
            </div>
            <div className="flex text-gray-400 text-xl font-semibold">
              Quantity
            </div>
            <div className="flex text-gray-400 text-xl font-semibold">
              Item Price
            </div>
            <div className="flex text-gray-400 text-xl font-semibold">
              Total Price
            </div>
            <div className="flex text-gray-400 text-xl font-semibold px-4">
              Remove
            </div>
          </div>
          {!isLoading && 
            cartInfo.map(product => { 
              return <CartItem
                product={product}
                key={product._id}
                setCartInfo={setCartInfo}
                updateCart={updateCart}
                cartInfo={cartInfo}
                setCart={setCart}
                cart={cart}
              />})
          }
        </div>
      </main>
    </div>
  )
}

export default CartPage