import { createContext, useEffect, useState } from "react";
import axios from "axios";

const ProductsContext = createContext()
//maybe use usememo here
const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(null)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('fetching products')
        const res = await axios.get('http://localhost:5000/api/v1/products')
        setProducts(res.data.products)
      } catch(err) {
        console.log(err)
      }
    }
    if (!products) {
      fetchProducts()
    }
  }, [])
  return (
    <ProductsContext.Provider value={({ products, setProducts })}>
      {children}
    </ProductsContext.Provider>
  )
}

export { ProductsContext, ProductsProvider }