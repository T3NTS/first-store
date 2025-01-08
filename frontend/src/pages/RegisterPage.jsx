import {React, useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { UserContext } from "../context/UserContext";

const RegisterPage = (props) => {
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [productError, setProductError] = useState(false)
  const [loginInfo, setLoginInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const register = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', loginInfo)
      console.log(res)
      const { token, user: { email, name } } = res.data
      console.log(token, name, email)
      setUser({
        name: name,
        email: email
      })
      navigate('/')
      localStorage.setItem('token', token)
    } catch(err) {
      console.log(err)
      setProductError({
        message: err.response.data.msg
      })
    }
  }
  
  return (
    <div onClick={() => setProductError(false)} className="flex flex-col min-h-screen bg-slate-900">
      <Navbar/>
      <main className="flex flex-col flex-1 items-center justify-center">
        <div className="flex flex-col items-center p-4 bg-slate-950 w-2/5 rounded-lg">
          <h1 className="text-gray-200 text-3xl mb-8 font-semibold">
            Register
          </h1>
          <div className=" flex flex-col w-full">
            <input 
              placeholder="Name"
              name="name"
              onChange={(e) => setLoginInfo({
                ...loginInfo,
                name: e.target.value
              })}
              className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600 mb-4"/>
            <input 
              placeholder="Email"
              name="email"
              onChange={(e) => setLoginInfo({
                ...loginInfo,
                email: e.target.value
              })}
              className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600 mb-4"/>
            <input
              placeholder="Password"
              name="password"
              type="password"
              onChange={(e) => setLoginInfo({
                ...loginInfo,
                password: e.target.value
              })}
              className="w-full h-10 rounded p-4 text-white bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 outline outline-2 outline-gray-600"/>
            <label className="text-gray-400 mt-1">Password must be at least 6 characters</label>
          </div>
          <button onClick={register} className="w-1/2 text-xl semibold h-8 bg-cyan-400 mt-2 rounded hover:opacity-80 transition">
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

export default RegisterPage