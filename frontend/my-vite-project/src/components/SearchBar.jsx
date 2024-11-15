import { useState } from "react";
import { IoIosOptions } from "react-icons/io";
import { IoSearch } from "react-icons/io5";


const SearchBar = (props) => {
  const {setIsFilterOpen, setSearchQuery} = props
  const [inputValue, setInputValue] = useState("")

  const handleOnKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('pressed enter')
      setSearchQuery(prev => ({
        ...prev,
        name: inputValue
      }));
    }
  }
  return (
    <div className='flex h-12 w-full mr-16'>
      <button 
        onClick={() => setSearchQuery(prev => ({
          ...prev,
          name: inputValue
        }))} 
        onKeyDown={(e) => handleOnKeyDown(e)} 
        className='flex justify-center items-center h-full aspect-[1] rounded-l-lg bg-cyan-500 hover:bg-cyan-400 transition'
      >
        <IoSearch  className=' text-gray-200 h-1/2 w-1/2'/>
      </button>
      <input 
        className='z-1 w-full h-full p-4 text-gray-400 bg-slate-800 focus:bg-gray-800 outline-none'
        name="search"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => setIsFilterOpen(prev => !prev)} className='flex justify-center items-center h-full aspect-[1] rounded-r-lg bg-cyan-500 hover:bg-cyan-400 transition'>
        <IoIosOptions className='text-white h-1/2 w-1/2'/>
      </button>
    </div>
  )
}

export default SearchBar