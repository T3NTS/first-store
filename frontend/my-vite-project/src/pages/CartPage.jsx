import {React, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartProduct";


const CartPage = (props) => {
  const { user, setUser, products, cart, setCart } = props
  const cartElements = cart.items.map(item => {
    console.log(cart)
    return (
      <CartItem
        product={item}
        key={item._id}
      />
    )
  })
  return (
    <div className="flex flex-col items-center min-h-screen h-cover bg-slate-900">
      <Navbar
        user={user}
        setUser={setUser}
      />
      <main className="flex flex-col mt-20 items-center p-8">
        <div className="h-full w-full bg-slate-950">
          <h1 className="text-gray-400 text-2xl p-4 font-bold text-center mb-8">{`Your Cart (${cart.items.length} items)`}</h1>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <div className="flex px-4">
            </div>
            <div className="flex text-gray-400 text-xl font-semibold pl-6">
              Name
            </div>
            <div className="flex text-gray-400 text-xl font-semibold pl-6">
              Quantity
            </div>
            <div className="flex text-gray-400 text-xl font-semibold">
              Total Price
            </div>
            <div className="flex text-gray-400 text-xl font-semibold px-4">
              Remove
            </div>
          </div>
          {cartElements}
        </div>
      </main>
    </div>
  )
}

export default CartPage