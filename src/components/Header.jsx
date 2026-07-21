import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { setSidebarOpen, setSidebarOpenMobile } from '../Store/Action/Sidebar/Sidebar_Action';
import { useDispatch } from 'react-redux';
import { useToggleSideBar } from '../Store/Selectors/Sidebar/Sidebar_Selector';
import { getProfile } from '../Store/Action/Auth/Auth_Action';
import { useUserProfile } from '../Store/Selectors/Auth/Auth_Selector';
import Logout from '../auth/Logout';
import ProfileEdit from '../auth/ProfileEdit';

const Header = ({ name }) => {
  const dispatch = useDispatch();
  const isOpen = useToggleSideBar();
  const [isLogout, setIsLogout] = useState(false)
  const [isProfileUpdate, setIsProfileUpdate] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userDetails = useUserProfile()?.Data

  const HandleOpenProfile = async () => {
    setIsProfileUpdate(true)
    GetProfileData()
  }

  const HandleCloseProfile = async () => {
    setIsProfileUpdate(false)
    GetProfileData()
  }
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const GetProfileData = async () => {
    try {
      await dispatch(getProfile())
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    GetProfileData()
  }, [])

  return (
    <>
      <header className="bg-white shadow-sm border-b border-l3 px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Page Title on Left */}
        <div className="flex items-center space-x-3">

          <div
            className="hidden lg:flex w-7 h-7 rounded-full bg-primary  items-center justify-center z-20 cursor-pointer"
            onClick={() => dispatch(setSidebarOpen(!isOpen))}
          >
            <span className={` text-16 lg:text-18 2xl:text-20 text-white ${isOpen ? 'icon-left' : 'icon-right'} `} />
          </div>
          <div
            className="flex lg:hidden w-7 h-7 rounded-full bg-primary  items-center justify-center z-20 cursor-pointer"
            onClick={() => dispatch(setSidebarOpenMobile(true))}
          >
            <span className={` text-16 lg:text-18 2xl:text-20 text-white ${isOpen ? 'icon-left' : 'icon-right'} `} />
          </div>
          <h2 className="text-18 lg:text-20 font-semibold text-g1">{name}</h2>
        </div>

        {/* User Dropdown on Right */}
        <div className="flex items-center space-x-2">
          {/* Notification Icon */}
          <div className='relative group'>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4423] absolute right-1 top-0"></div>
            <button className="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-l2 flex items-center justify-center cursor-pointer">
              <span className="icon-notification text-[18px] lg:text-[20px] xl:text-[24px] text-g7"></span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-l4"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 bg-l3 rounded-full mx-auto overflow-hidden flex items-center justify-center border border-l2">
                {userDetails?.profile ? <img src={import.meta.env.VITE_BUCKET_URL + userDetails?.profile} alt="profile" className='object-cover w-full h-full' /> : <span className="icon-user-fill text-[22px] md:text-[28px] text-g7"></span>}
              </div>
              <span className="text-g1 font-medium hidden lg:block">{userDetails?.name}</span>
              <span className="icon-arrow-down text-g5 text-12"></span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-14 right-0 w-40 anim bg-white border border-l2 rounded-xl py-3 px-2 z-20">
                <div className="flex items-center space-x-2 p-1 cursor-pointer" onClick={() => HandleOpenProfile()}>
                  <span className="icon-edit text-[18px] text-g1"></span>
                  <span className="inline-block text-12 md:text-14 font-medium text-g1 text-nowrap">Edit Profile</span>
                </div>
                <div className="flex items-center space-x-2 p-1 cursor-pointer" onClick={() => setIsLogout(true)}>
                  <span className="icon-logout text-[18px] text-[#DC2626]"></span>
                  <span className="inline-block text-12 md:text-14 font-medium text-[#DC2626] text-nowrap">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {isLogout && <Logout onClose={() => setIsLogout(false)} />}
      {isProfileUpdate && <ProfileEdit onClose={HandleCloseProfile} />}
    </>
  )
}

export default Header
