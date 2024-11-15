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

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/products')
      setProducts(res.data.products)
    } catch(err) {
      throw err
    }
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const res = await axios.get('http://localhost:5000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}`}
        })
        setUser(res.data)
      }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
    fetchUser()
  }, [])

  return (
    <Routes>
			<Route 
        path="/" 
        element={
          <HomePage
            products={products}
            setProducts={setProducts}
            user={user}
            setUser={setUser}
          />}
      />
      <Route 
        path="/create" 
        element={
          <CreatePage
            products={products}
            setProducts={setProducts}
            fetchData={fetchData}
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
          />}
      />
      <Route 
        path="/products/:productId/edit" 
        element={
          <EditPage
            products={products}
            setProducts={setProducts}
            fetchData={fetchData}
            user={user}
          />}
      />
		</Routes>
  )
}

export default App
