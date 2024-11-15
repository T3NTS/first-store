import {React, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";

const EditPage = (props) => {
  const { products, setProducts, fetchData, user } = props
  const [productError, setProductError] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageURL: "",
    updatedAt: ""
  })

  const location = useLocation()
  const navigate = useNavigate()

  const updateProducts = async () => {
    const date = new Date()
    newProduct.updatedAt = date.toISOString()
    try {
      const res = await axios.patch(`http://localhost:5000/api/v1/protected${location.pathname.slice(0, location.pathname.length - 5)}`, newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      
      setProducts(oldProducts => oldProducts.map((item) => {
        return item._id === res.data.product._id ? res.data.product : item
      }))
      navigate('/')
    } catch(err) {
      console.log(err.response.data)
      setProductError({
        message: err.response.data.msg
      })
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/protected${location.pathname.slice(0, location.pathname.length - 5)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setNewProduct({
        imageURL: res.data.product.imageURL,
        price: res.data.product.price,
        name: res.data.product.name
      })
    } catch(err) {
      console.log(err)
    }
  }

  const deleteProduct = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/v1/protected${location.pathname.slice(0, location.pathname.length - 5)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setProducts(oldProducts => oldProducts.filter(item => item._id !== res.data.id))
      navigate('/')
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  return (
    <div onClick={() => setProductError(false)} className="flex flex-col min-h-screen bg-slate-900">
    <Navbar
      user={user}
    />
    <main className="flex flex-col flex-1 items-center justify-center">
      {newProduct ? <div className="flex flex-col items-center p-4 bg-slate-950 w-2/5 rounded-lg">
        <h1 className="text-gray-200 text-3xl mb-8 font-semibold">
          Edit Product
        </h1>
        <div className="space-y-4 w-full mb-2">
          <input 
            placeholder="Name"
            name="name"
            onChange={(e) => setNewProduct({
              ...newProduct,
              name: e.target.value
            })}
            value={newProduct.name}
            className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
          <input 
            placeholder="Price"
            name="price"
            onChange={(e) => setNewProduct({
              ...newProduct,
              price: e.target.value
            })}
            value={newProduct.price}
            className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
          <input 
            placeholder="ImageURL"
            name="imageURL"
            onChange={(e) => setNewProduct({
              ...newProduct,
              imageURL: e.target.value
            })}
            value={newProduct.imageURL}
            className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
        </div>
        <div className="flex w-full justify-center">
          <button onClick={updateProducts} className=" text-xl semibold h-8 bg-cyan-400 mt-2 rounded hover:opacity-80 transition mr-4 px-4">
            Save
          </button>
          <button onClick={deleteProduct} className=" text-xl semibold h-8 bg-red-500 mt-2 rounded hover:opacity-80 px-4 transition">
            Delete
          </button>
        </div>
      </div> : 
        <h1>Loading...</h1>
      }
      {productError && 
        <div className="flex p-4 bg-red-700 rounded mt-12">
          <h4 className="text-gray-200 text-sm">
            {productError.message}
          </h4>
        </div>
      }
    </main>
  </div>
  )
}

export default EditPage