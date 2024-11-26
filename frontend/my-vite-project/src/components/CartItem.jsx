import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { FaPlus, FaMinus  } from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";


const CartItem = (props) => {
  const { product: { imageURL, name, price, quantity, _id }, setCartInfo, updateCart, cartInfo, setCart, cart } = props
  const [inputValue, setInputValue] = useState(quantity)
  const [totalPrice, setTotalPrice] = useState(inputValue * price)

  const handleOnKeyDown = async (e) => {
    if (e.key === 'Enter') {
      try {
        await updateCart({ 
          productId: _id, 
          quantity: Number(inputValue), 
          action: 'update' 
        })
        setTotalPrice(inputValue * price)
        setCart(prev => ({
          ...prev,
          items: prev.items.map(item => {
            return item.productId === _id ? {
              ...item,
              quantity: Number(inputValue)
            } : item
          })
        }))
      } catch(err) {
        console.log(err)
      }
    }
  }

  const handleClick = async (value) => {
    const newQuantity = Number(inputValue) + value
    try {
      await updateCart({ 
        productId: _id, 
        quantity: 1,
        action: 'update'
      })
      setInputValue(newQuantity)
      setTotalPrice(newQuantity * price)
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => {
          return item.productId === _id ? {
            ...item,
            quantity: newQuantity
          } : item
        })
      }))
    } catch(err) {
      console.log(err)
    }
  }

  const removeItem = async () => {
    try {
      await updateCart({
        productId: _id,
        action: 'delete'
      })
      const newCartInfo = cartInfo.filter(item => item._id !== _id)
      setCartInfo(newCartInfo)
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.productId !== _id)
      }))
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="flex bg-slate-950">
      <div className="grid p-4 items-center grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
          <img className="w-48 md:h-28 lg:w-108 lg:h-56 object-cover rounded-xl" src={imageURL}/>
          <div className="flex px-4">
            <h3 className="flex h-full text-gray-400 text-lg font-semibold">{name}</h3>
          </div>
          <div className="flex pl-2">
            <button onClick={() => handleClick(1)} className="w-12 h-12 bg-pink-500 px-4 py-2 hover:bg-pink-700 transition">
              <FaPlus className="text-slate-950"/>
            </button>
            <input
              type="text"
              name="quantity"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleOnKeyDown}
              className="bg-slate-800 w-12 h-12 p-2 text-gray-400 text-center focus:outline-none"
            />
            <button onClick={() => handleClick(-1)} disabled={inputValue === 1} className={`w-12 h-12 ${inputValue === 1 ? 'opacity-50' : 'hover:bg-cyan-700'} bg-cyan-500 px-4 py-2 transition`}>
              <FaMinus className="text-slate-950"/>
            </button>
          </div>
          <div className="flex">
            <h3 className="flex h-full text-gray-400 text-lg font-semibold">${price}</h3>
          </div>
          <div className="flex">
            <h3 className="flex h-full text-gray-400 text-lg font-semibold">${totalPrice}</h3>
          </div>
          <div className="flex px-4 p-4">
            <button onClick={removeItem} className="flex text-gray-200 text-lg font-semibold ">
              <HiOutlineXMark className="w-8 h-8"/>
            </button>
          </div>
        </div>
    </div>
  )
}

export default CartItem