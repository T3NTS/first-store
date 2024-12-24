import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SingleProductPage from './pages/SingleProductPage';
import EditPage from './pages/EditPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ChatPage from './pages/ChatPage';
import SingleChatPage from './pages/SingleChatPage';
import { WebSocketProvider } from './context/WebSocketContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';

//YOU HAVE A SHIT WAY OF DEALING WITH WEBSCOKET RN, ITS ALSO IN LOGINPAGE.JSX
//THERSE security issues regards to storing sh in lcoalstorage
//Double chat still aint solved
function App() {
//YOU NEED TO USE .POPULATE IN CART !!!!
//USE lazy fetching when scrolling up in chat
//Maybe make chats property more global as it always fetches all chats when moving to new chat
//Also chats aint changin when a new message is sent!
//Havent done shit with seen + 
//change sort by updated not created
 return (
    <UserProvider>
      <ProductsProvider>
        <CartProvider>
          <WebSocketProvider>
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage/>}
              />
              <Route 
                path="/create" 
                element={
                  <CreatePage/>} 
              />
              <Route 
                path="/login" 
                element={
                  <LoginPage/>} 
              />
              <Route 
                path="/register" 
                element={
                  <RegisterPage/>} 
              />
              <Route 
                path="/profile" 
                element={
                  <ProfilePage/>}
              />
              <Route 
                path="/user/:userId/cart" 
                element={
                  <CartPage/>}
              />
              <Route 
                path="/products/:productId" 
                element={
                  <SingleProductPage/>}
              />
              <Route 
                path="/products/:productId/edit" 
                element={
                  <EditPage/>}
              />
              <Route 
                path="/user/:userId/chat" 
                element={
                  <ChatPage/>}
              />
              <Route 
                path="/user/:buyer/chat/:productId" 
                element={
                  <SingleChatPage/>}
              />
            </Routes>
          </WebSocketProvider>
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  )
}

export default App
