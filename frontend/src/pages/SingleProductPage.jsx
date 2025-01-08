import {React, useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useWebSocketContext } from "../context/WebSocketContext";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const SingleProductPage = (props) => {
  const [product, setProduct] = useState(null)
  const socket = useWebSocketContext()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { setCart } = useContext(CartContext)

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/protected${location.pathname}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setProduct({
        ...res.data
      })
    } catch(err) {
      console.log(err)
    }
  }
  
  const formatDate = (unFormattedDate) => {
    const date = new Date(unFormattedDate)
    return date.toLocaleString()
  }

  const handleClick = () => {
    navigate(`${location.pathname}/edit`)
  }

  const addToCart = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/v1/users/${user.userId}/cart`, { productId: product._id, quantity: 1, action: 'add'},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCart(res.data)
    } catch(err) {
      console.log(err)
    }
  }
//you can make that better by removing fetch_roomid and change roomid to userid+sellerid
  const joinRoom = () => {
    if (socket) {
      const { userId } = user
      const { _id, createdBy } = product
      console.log({ buyerId: userId, productId: _id, sellerId: createdBy })
      socket.emit('fetch_roomid', { buyerId: userId, productId: _id, sellerId: createdBy }, (roomId) => {
        navigate(`/user/${userId}/chat/${roomId}`)
      })
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar/>
      <main className="flex justify-center mt-20 px-80 h-screen">
        {product ? 
          <div className="flex flex-col bg-gray-800 my-4 p-4 rounded-xl w-full ">
            <div className="flex h-1/2 w-full bg-black ">
              <img src={product.imageURL} className="object-scale-down w-full "/>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div>
                <h2 className="text-gray-200 text-4xl mt-4 font-bold mb-4">
                  {product.name}
                </h2>

                <div className="flex flex-row items-center font-semibold mt-8 mb-8">
                  
                  <h1 className="text-pink-500 text-5xl">
                  ${product.price}
                </h1>
                </div>

                {product.createdBy._id !== user.userId && 
                <div className="flex flex-row items-center font-semibold mt-4">
                  <h4 className="text-gray-200 text-2xl mr-4">
                    Owner:
                  </h4>
                  <h1 className="text-cyan-500 text-2xl">
                  {product.createdBy.name}
                </h1>
                </div>}

                <div className="flex flex-row items-center font-semibold mt-4">
                  <h4 className="text-gray-200 text-2xl mr-4">
                    Created:
                  </h4>
                  <h1 className="text-cyan-500 text-2xl">
                  {formatDate(product.createdAt)}
                </h1>
                </div>
                <div className="flex flex-row items-center font-semibold mt-4">
                  <h4 className="text-gray-200 text-2xl mr-4">
                    Updated:
                  </h4>
                  <h1 className="text-cyan-500 text-2xl">
                    {formatDate(product.updatedAt)}
                  </h1>
                </div>
                {product.createdBy._id !== user.userId && 
                <div className="flex gap-4 mt-4">
                  <button onClick={addToCart} className="bg-cyan-500 mt-4 p-4 rounded-lg hover:bg-cyan-300 transition font-semibold text-xl">
                    Add To Cart
                  </button>
                  <button onClick={joinRoom} className="bg-cyan-500 mt-4 p-4 rounded-lg hover:bg-cyan-300 transition font-semibold text-xl">
                    Message
                  </button>
                </div>
                }
              </div>
              {product.createdBy._id === user.userId && 
                <div className="flex h-full mt-4">
                  <button onClick={handleClick} className="hover:bg-slate-600 w-10 h-10 flex items-center justify-center rounded-lg transition">
                    <IoSettingsOutline className="text-gray-200 w-7 h-7"/>
                  </button>
                </div>}
            </div>
          </div> : 
            <h1>Loading...</h1>
        }
      </main>
    </div>
  )
}

export default SingleProductPage