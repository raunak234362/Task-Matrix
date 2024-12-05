/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaCaretLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import LOGO from '../assets/logo.png'
import { useEffect, useState } from 'react'
import Service from '../../config/Service'

const Header = ({ sidebarOpen, toggleSidebar }) => {
  const data = useSelector((state) => state.userData.userData)
  const token = sessionStorage.getItem('token')
  const [currentUser, setCurrentUser] = useState()

  const fetchUserData = async () => {
    const userData = await Service.getCurrentUser(token)
    setCurrentUser(userData[0])
  }

  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <div className="flex md:px-5 rounded-xl justify-between items-center w-full bg-white bg-opacity-50 text-slate-800  border-4">
      <div className={`flex items-center p-1 transition-all duration-300 `}>
        {/* <div
          className={`fixed inset-0 z-10 transition-opacity duration-300 `}
          onClick={toggleSidebar}
        ></div> */}
        <img src={LOGO} alt="" className="md:w-32 w-20" />
      </div>

      <button className="p-2 m-2 md:hidden bg-green-500 text-white rounded" onClick={toggleSidebar}>
        {sidebarOpen ? <FaCaretLeft /> : <GiHamburgerMenu />}
      </button>
      <div className="hidden md:block text-2xl font-semibold">{currentUser?.username}</div>
    </div>
  )
}

export default Header
