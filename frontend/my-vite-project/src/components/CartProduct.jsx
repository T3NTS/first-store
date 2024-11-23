import { useEffect, useState } from "react"
import axios from "axios"
import { FaPlus, FaMinus  } from "react-icons/fa";


const CartItem = (props) => {
  const { product } = props
  const { productId, quantity } = product
  const [productInfo, setProductInfo] = useState(null)
  const [inputQuantity, setInputQuantity] = useState({
    quantity: quantity
  })

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/protected/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setProductInfo({
        ...res.data.product
      })
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])
  
  return (
    <div className="flex bg-slate-950">
      {productInfo && (
        <div className="grid p-4 grid-cols-4 items-center">
            <img className="w-48 md:h-28 lg:w-108 lg:h-56 object-cover rounded-xl" src={productInfo.imageURL}/>
            <div className="flex px-4">
              <h3 className="flex h-full text-gray-400 text-lg font-semibold">{productInfo.name}</h3>
            </div>
            <div className="flex px-4">
              <button className="w-12 h-12 bg-pink-500 px-4 py-2 hover:bg-pink-700 transition">
                <FaPlus className="text-slate-950"/>
              </button>
              <input
                type="text"
                name="quantity"
                value={quantity}
                onChange={(e) => setInputQuantity({
                  name: e.target.value
                })}
                className="bg-slate-800 w-12 h-12 p-2 text-gray-400 text-center focus:outline-none"
              />
              <button className="w-12 h-12 bg-cyan-500 px-4 py-2 hover:bg-cyan-700 transition">
                <FaMinus className="text-slate-950"/>
              </button>
            </div>
            <div className="flex px-4 text-gray-400 text-lg font-semibold">
              <h3 className="flexh-full">${productInfo.price}</h3>
            </div>
          </div>
      )}
    </div>
  )
}

export default CartItem