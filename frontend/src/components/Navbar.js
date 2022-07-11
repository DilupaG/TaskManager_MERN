import { useState } from 'react'
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa'
import { useAppContext } from '../context/appContext'
import Logo from './Logo'
import Wrapper from '../assets/wrappers/Navbar'

const Navbar = () => {

  const [showLogOut, setShowLogout] = useState(false);
  const {toggleSidebar, logoutUser, user} = useAppContext()

  return (
    <Wrapper>
      <div className='nav-center'>
        <button
          className='toggle-btn'
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>

        <div>
          <Logo />
          <h3 className='logo-text'>
            <span>1</span>billion Task  Manager
          </h3>
        </div>

        <div className='btn-container'>
          <button className='btn' onClick={() => setShowLogout(!showLogOut)}>
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogOut?'dropdown show-dropdown':'dropdown'}>
            <button
              onClick={logoutUser}
              className='dropdown-btn'
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar