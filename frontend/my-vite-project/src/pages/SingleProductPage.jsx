import {React, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";

const SingleProductPage = (props) => {
  const { products, setProducts, user, setUser, cart, setCart } = props
  const [product, setProduct] = useState(null)
  const [ownerName, setOwnerName] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/protected${location.pathname}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setProduct({
        ...res.data.product
      })
      const res2 = await axios.get('http://localhost:5000/api/v1/auth/getname', {
        headers: { OwnerId: res.data.product.createdBy}
      })
      setOwnerName(res2.data.name)
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

  useEffect(() => {
    fetchProduct()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar
        user={user}
        setUser={setUser}
        cart={cart}
      />
      <main className="flex justify-center mt-20 px-80">
        {product ? 
          <div className="flex flex-col bg-gray-800 mt-4 mb-4 p-4 rounded-xl w-full">
            <img src={product.imageURL} className="object-cover w-full rounded-xl"/>
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

                {product.createdBy !== user.userId && 
                <div className="flex flex-row items-center font-semibold mt-4">
                  <h4 className="text-gray-200 text-2xl mr-4">
                    Owner:
                  </h4>
                  <h1 className="text-cyan-500 text-2xl">
                  {ownerName}
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
                <button onClick={addToCart} className="bg-cyan-500 mt-4 p-4 rounded-lg hover:bg-cyan-300 transition font-semibold text-xl">
                  Add To Cart
                </button>
              </div>
              {product.createdBy === user.userId && 
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