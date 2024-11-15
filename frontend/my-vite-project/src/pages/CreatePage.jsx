import {React, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const CreatePage = (props) => {
  const { products, setProducts, fetchData, user } = props
  const [productError, setProductError] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageURL: ''
  })

  const navigate = useNavigate()

  const updateProducts = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/protected/products', newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setProducts(oldProducts => [...oldProducts, res.data.product])
      navigate('/')
    } catch(err) {
      console.log(err.response.data)
      setProductError({
        message: err.response.data.msg
      })
    }
  }

  return (
    <div onClick={() => setProductError(false)} className="flex flex-col min-h-screen bg-slate-900">
    <Navbar
      user={user}
    />
    <main className="flex flex-col flex-1 items-center justify-center">
      <div className="flex flex-col items-center p-4 bg-slate-950 w-2/5 rounded-lg">
        <h1 className="text-gray-200 text-3xl mb-8 font-semibold">
          Create Product
        </h1>
        <div className="space-y-4 w-full mb-2">
          <input 
            placeholder="Name"
            name="name"
            onChange={(e) => setNewProduct({
              ...newProduct,
              name: e.target.value
            })}
            className="w-full h-10 rounded p-4 text-gray-200 bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
          <input 
            placeholder="Price"
            name="price"
            onChange={(e) => setNewProduct({
              ...newProduct,
              price: e.target.value
            })}
            className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
          <input 
            placeholder="ImageURL"
            name="imageURL"
            onChange={(e) => setNewProduct({
              ...newProduct,
              imageURL: e.target.value
            })}
            className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
        </div>
        <button onClick={updateProducts} className="w-1/2 text-xl semibold h-8 bg-cyan-400 mt-2 rounded hover:opacity-80 transition">
          Save
        </button>
      </div>
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

export default CreatePage