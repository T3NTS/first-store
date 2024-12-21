import {React, useEffect, useRef, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import SortingButtons from "../components/SortingButtons";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";

const HomePage = (props) => {
  const { products, user, setUser, cart } = props
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(null)
  const [isArrowUp, setIsArrowUp] = useState(false)
  const [currentSortElement, setCurrentSortElement] = useState(<h3 className="text-gray-500">Newest</h3>)
  const isInitialMount = useRef(true)
  const [filterValues, setFilterValues] = useState({
    from: '',
    to: ''
  })

  const [searchQuery, setSearchQuery] = useState({
    from: '',
    to: '',
    name: '',
    sort: '-createdAt'
  })

  const getFilteredElements = async () => {
    const {from, to, name, sort} = searchQuery
    console.log('get filtered')
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/products?from=${from}&to=${to}&sort=${sort}&${name ? `name=${name}` : ''}`)
      setFilteredProducts(res.data.products)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      getFilteredElements()
    }
  }, [searchQuery])

  const handleSortClick = (sort) => {
    setIsArrowUp(prev => !prev)
    setCurrentSortElement(sortElements[sort])
    setSearchQuery(prev => ({
      ...prev,
      sort: sort
    }))
  }

  const sortElements = {
    '-createdAt': <h3 className="text-gray-500">Newest</h3>,
    'createdAt': <h3 className="text-gray-500">Oldest</h3>,
    'price': 
      <div className="flex items-center">
        <h3>Price</h3><FaLongArrowAltUp className="text-gray-500"/>
      </div>,
    '-price':
    <div className="flex items-center">
      <h3>Price</h3><FaLongArrowAltDown className="text-gray-500"/>
    </div>
  }

  return (
    <div className="flex flex-col items-center min-h-screen h-cover bg-slate-900">
      {filteredProducts &&
        <>
        <Navbar
          setIsFilterOpen={setIsFilterOpen}
          user={user}
          setUser={setUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterValues={filterValues}
          cart={cart}
      />
      <main className="flex flex-col mt-20 items-center px-8">
        {isFilterOpen && (
          <Filters 
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
        )}
        <div className="flex relative w-full mt-4 ml-8">
          <button onClick={() => setIsArrowUp(prev => !prev)} className="flex items-center bg-gray-950 text-gray-500 p-3 rounded font-semibold">
            {currentSortElement}
            {isArrowUp ? <GoTriangleUp className="text-gray-500"/> : <GoTriangleDown className="text-gray-500"/>}
          </button>
          {isArrowUp && (
            <SortingButtons 
              handleSortClick={handleSortClick}
            />
          )}
        </div>
        <div className="flex flex-col space-y-4">
        <div className="flex mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 p-4">
            {filteredProducts && 
              filteredProducts.map(item => {
                return (
                  <ProductCard
                    product={item}
                    key={item._id}
                    user={user}
                  />
                )
              })}
          </div>
        </div>
        </div>
      </main>
        </>
      }
    
    </div>
  )
}
export default HomePage