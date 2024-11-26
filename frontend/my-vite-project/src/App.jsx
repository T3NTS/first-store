import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import ProfilePage from './pages/ProfilePage';
import SingleProductPage from './pages/SingleProductPage';
import EditPage from './pages/EditPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
//LATER FIX FETCHING MULTIPLE TIMES 
function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : null
  })
/*
  const fetchProductsData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/products')
      setProducts(res.data.products)
    } catch(err) {
      throw err
    }
  }*/

  const fetchUserData = async () => {
    try {
      console.log('fetching data')
      const res = await axios.get('http://localhost:5000/api/v1/products')
      setProducts(res.data.products)
      const token = localStorage.getItem('token')
      if (token) {
        const res = await axios.get('http://localhost:5000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}`}
        })
        setUser(res.data)
        if (!cart) {
          const resCart = await axios.get(`http://localhost:5000/api/v1/users/${res.data.userId}/cart`, {
            headers: { Authorization: `Bearer ${token}`}
          })
          localStorage.setItem('cart', JSON.stringify(resCart.data))
          setCart(resCart.data)
        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    //fetchProductsData()
    fetchUserData()
    setIsLoading(false)
  }, [])
  return !isLoading && ( 
    <Routes>
			<Route 
        path="/" 
        element={
          <HomePage
            products={products}
            setProducts={setProducts}
            user={user}
            setUser={setUser}
            cart={cart}
          />}
      />
      <Route 
        path="/create" 
        element={
          <CreatePage
            products={products}
            setProducts={setProducts}
            user={user}
            setUser={setUser}
          />} 
      />
      <Route 
        path="/login" 
        element={
          <LoginPage
            setUser={setUser}
          />} 
      />
      <Route 
        path="/register" 
        element={
          <RegisterPage
            setUser={setUser}
          />} 
      />
      <Route 
        path="/profile" 
        element={
          <ProfilePage
            products={products}
            setProducts={setProducts}
            user={user}
            setUser={setUser}
            cart={cart}
            setCart={setCart}
          />}
      />
      <Route 
        path="/user/:userId/cart" 
        element={
          <CartPage
            products={products}
            user={user}
            setUser={setUser}
            cart={cart}
            setCart={setCart}
          />}
      />
      <Route 
        path="/products/:productId" 
        element={
          <SingleProductPage
            products={products}
            setProducts={setProducts}
            user={user}
            setUser={setUser}
            cart={cart}
            setCart={setCart}
          />}
      />
      <Route 
        path="/products/:productId/edit" 
        element={
          <EditPage
            products={products}
            setProducts={setProducts}
            user={user}
          />}
      />
		</Routes>
  )
}

export default App
