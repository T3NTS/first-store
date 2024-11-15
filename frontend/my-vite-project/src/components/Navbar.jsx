import {React, useEffect, useState} from 'react';
import { CiLogin, CiLogout, CiShoppingCart } from "react-icons/ci";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RxHamburgerMenu } from "react-icons/rx";
import SearchBar from './SearchBar';
import LoginButton from './LoginButton';
import MainLogo from './MainLogo'

const Navbar = (props) => {
  const { user, setUser, setIsFilterOpen, searchQuery, setSearchQuery } = props
  const [isOpen, setIsOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const hideSearchBar = ['/'].includes(location.pathname)
  const hideName = ['/login'].includes(location.pathname)
  const hideLogin = ['/login', '/create'].includes(location.pathname)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className='flex fixed w-full h-20 bg-gray-950 mb-4 z-50'>
      <div className='flex w-full h-full justify-between items-center ml-24 mr-12'>
        <MainLogo />

        {hideSearchBar && (
          <SearchBar
            setIsFilterOpen={setIsFilterOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        <div className='flex items-center space-x-4'>
          {!hideName && (
            <h3 className='text-lg text-white'>
              Hello, {user ? user.name : 'log in'}
            </h3>
          )}

          {!hideLogin && (
            <LoginButton 
              user={user}
              logout={logout}
            />
          )}

          {/* Shopping cart */}
          <div className='min-h-12 min-w-12 flex items-center justify-center rounded hover:bg-gray-600 transition'>
            <Link to="/">
              <CiShoppingCart className='text-white w-7 h-7'/>
            </Link>
          </div>

          {/* Hamburger menu */}
          <div className='min-h-12 min-w-12 flex flex-col items-center justify-center rounded hover:bg-gray-600 transition'>
            <button onClick={() => setIsOpen(!isOpen)}>
              <RxHamburgerMenu className='text-white w-7 h-7'/>
            </button>
            {isOpen && (
              <div className="absolute top-16 right-0 mt-2 min-w-32 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Link
                    to={user ? "/profile" : "/login"}
                    className="text-gray-200 block px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    My products
                  </Link>
                  <Link
                    to={user ? "/create" : "/login"}
                    className="text-gray-200 block px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Create product
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar