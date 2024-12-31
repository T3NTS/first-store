import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

const SortingButtons = (props) => {
  const { handleSortClick } = props

  return (
    <div className="flex z-40 flex-col absolute left-0 top-full bg-gray-800 text-white rounded shadow-lg">
      <button onClick={() => handleSortClick('-updatedAt')} className="w-full hover:bg-gray-700 py-4 px-8 rounded text-gray-200">Newest</button>
      <button onClick={() => handleSortClick('updatedAt')} className="w-full hover:bg-gray-700 py-4 px-4 rounded text-gray-200">Oldest</button>
      <button onClick={() => handleSortClick('price')} className="flex items-center w-full hover:bg-gray-700 py-4 px-8 rounded text-gray-200">Price <FaLongArrowAltUp className="text-gray-200 ml-1"/></button>
      <button onClick={() => handleSortClick('-price')} className="flex items-center w-full hover:bg-gray-700 py-4 px-8 rounded text-gray-200">Price <FaLongArrowAltDown className="text-gray-200 ml-1"/></button>
    </div>  
  )
}

export default SortingButtons