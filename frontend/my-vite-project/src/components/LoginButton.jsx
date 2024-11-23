import { CiLogin, CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";

const LoginButton = (props) => {
  const {user, logout} = props
  return (
    <div className='min-h-12 min-w-12 flex items-center rounded justify-center hover:bg-gray-600 transition'>
      {user ? 
        <button onClick={logout}>
          <CiLogout className='text-white w-7 h-7'/>
        </button> :
        <Link to="/login">
          <CiLogin className='text-white w-7 h-7'/>
        </Link>}
    </div>
  )
}

export default LoginButton