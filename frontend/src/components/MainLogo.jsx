import { Link } from "react-router-dom"

const MainLogo = () => {
  return (
    <div className=''>
      <Link to="/">
        <h1 className='text-3xl mr-32 whitespace-nowrap bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 font-semibold bg-clip-text text-transparent'>
          express-store24.com
        </h1>
      </Link>
    </div>
  )
}

export default MainLogo