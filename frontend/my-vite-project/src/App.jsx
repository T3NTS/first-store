import { useState, useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client'
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import ProfilePage from './pages/ProfilePage';
import SingleProductPage from './pages/SingleProductPage';
import EditPage from './pages/EditPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ChatPage from './pages/ChatPage';
import SingleChatPage from './pages/SingleChatPage';
import useWebSocket from './socket/socket';
import { WebSocketProvider } from './context/WebSocketContext';

//YOU HAVE A SHIT WAY OF DEALING WITH WEBSCOKET RN, ITS ALSO IN LOGINPAGE.JSX
function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : null
  })
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
        console.log(res.data)
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
    fetchUserData()
    setIsLoading(false)
  }, [])

  return !isLoading && ( 
    <WebSocketProvider user={user}>
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
        <Route 
          path="/user/:userId/chat" 
          element={
            <ChatPage
              user={user}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />}
        />
        <Route 
          path="/user/:user1/chat/:user2" 
          element={
            <SingleChatPage
              user={user}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />}
        />
      </Routes>
    </WebSocketProvider>
  )
}

export default App
