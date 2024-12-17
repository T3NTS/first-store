import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = (props) => {
  const { product, user } = props
  const navigate = useNavigate()
  const handleClick = () => {
    {user ? navigate(`/products/${product._id}`) : navigate('/login')}
  }

  const formatPrice = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  return (
    <div onClick={handleClick} className="p-4 hover:-translate-y-2 bg-gray-800 cursor-pointer rounded flex flex-col relative mb-8 w-108 h-96 transition">
      <img className='h-2/3 object-cover  mb-2' src={product.imageURL}/>
      <h3 className='text-2xl text-wrap text-white font-semibold mb-2'>
        {product.name}
      </h3>
      <h2 className='text-3xl text-pink-500 font-bold'>
        ${formatPrice(product.price)}
      </h2>
    </div>
  )
}

export default ProductCard