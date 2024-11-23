import { useState } from "react"

const Filters = (props) => {
  const { setSearchQuery, filterValues, setFilterValues } = props
  return (
    <div className="flex flex-col bg-slate bg-gray-800 mt-2 p-4 rounded">
      <h3 className="text-gray-400 mb-2 text-xl font-semibold">Price</h3>
      <div className="flex items-center justify-between">
        <input 
          placeholder="From"
          className="h-10 min-w-[33%] rounded p-4 text-gray-200 bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 
            outline outline-2 outline-gray-600"
          name="from"
          onChange={(e) => setFilterValues({
            ...filterValues,
            from: e.target.value
          })}
        />
        <div className="flex  justify-center w-full">
          <h1 className="text-gray-500 text-3xl h-full font-semibold">-</h1>
        </div>
        <input 
          className="h-10 min-w-[33%] rounded p-4 text-gray-200 bg-slate-800 focus:bg-gray-800 focus:outline-cyan-400 
            outline outline-2 outline-gray-600"
          placeholder="To"
          name="to"
          onChange={(e) => setFilterValues({
            ...filterValues,
            to: e.target.value
          })}
        />
      </div>
      <div className="flex mt-4 justify-center">
        <button onClick={() => setSearchQuery(prev => ({
          ...prev,
          ...filterValues
        }))} className="w-1/2 text-xl semibold h-8 bg-cyan-400 mt-2 rounded hover:opacity-80 transition">
          Search
        </button>
      </div>
    </div>
  )
}

export default Filters