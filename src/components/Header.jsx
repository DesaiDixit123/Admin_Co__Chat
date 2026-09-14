import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { setSidebarOpen, setSidebarOpenMobile } from '../Store/Action/Sidebar/Sidebar_Action';
import { useDispatch } from 'react-redux';
import { useToggleSideBar } from '../Store/Selectors/Sidebar/Sidebar_Selector';
import { getProfile } from '../Store/Action/Auth/Auth_Action';
import { useUserProfile } from '../Store/Selectors/Auth/Auth_Selector';
import { notificationListWithPagination, notificationMarkRead } from '../Services/services';
import Logout from '../auth/Logout';
import ProfileEdit from '../auth/ProfileEdit';
import moment from 'moment';

const Header = ({ name }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useToggleSideBar();
  const [isLogout, setIsLogout] = useState(false);
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const userDetails = useUserProfile()?.Data;

  const HandleOpenProfile = async () => {
    setIsProfileUpdate(true);
    GetProfileData();
  };

  const HandleCloseProfile = async () => {
    setIsProfileUpdate(false);
    GetProfileData();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    const nextState = !isNotificationOpen;
    setIsNotificationOpen(nextState);
    if (isDropdownOpen) setIsDropdownOpen(false);
    if (nextState) {
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const res = await notificationListWithPagination({ page: 1, limit: 10 });
      if (res?.data?.IsSuccess && res?.data?.Data) {
        const docs = (res.data.Data.docs || []).filter(n => n.type !== 'ticket');
        setNotifications(docs);
        setUnreadCount(res.data.Data.unreadCount || 0);
      }
    } catch (err) {
      console.log('Error fetching notifications:', err);
    } finally {
      setLoadingNotif(false);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e?.stopPropagation();
    try {
      await notificationMarkRead({ all: true });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log('Error marking all notifications read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await notificationMarkRead({ notificationId: notif._id });
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      }
      setIsNotificationOpen(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.log('Error handling notification click:', err);
      setIsNotificationOpen(false);
    }
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const GetProfileData = async () => {
    try {
      await dispatch(getProfile());
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    GetProfileData();
    fetchNotifications();

    // Poll notifications every 30 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'subscription':
        return { bg: 'bg-purple-50 text-purple-600 border-purple-200', icon: '👑' };
      case 'user':
        return { bg: 'bg-blue-50 text-blue-600 border-blue-200', icon: '👤' };
      case 'product':
        return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: '🛍️' };
      default:
        return { bg: 'bg-gray-50 text-gray-600 border-gray-200', icon: '🔔' };
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-l3 px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Page Title on Left */}
        <div className="flex items-center space-x-3">
          <div
            className="hidden lg:flex w-7 h-7 rounded-full bg-primary items-center justify-center z-20 cursor-pointer"
            onClick={() => dispatch(setSidebarOpen(!isOpen))}
          >
            <span className={`text-16 lg:text-18 2xl:text-20 text-white ${isOpen ? 'icon-left' : 'icon-right'}`} />
          </div>
          <div
            className="flex lg:hidden w-7 h-7 rounded-full bg-primary items-center justify-center z-20 cursor-pointer"
            onClick={() => dispatch(setSidebarOpenMobile(true))}
          >
            <span className={`text-16 lg:text-18 2xl:text-20 text-white ${isOpen ? 'icon-left' : 'icon-right'}`} />
          </div>
          <h2 className="text-18 lg:text-20 font-semibold text-g1">{name}</h2>
        </div>

        {/* User & Notifications on Right */}
        <div className="flex items-center space-x-3">
          {/* Notification Icon & Dropdown */}
          <div className='relative' ref={notificationRef}>
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF4423] text-white text-[10px] font-bold absolute -top-1 -right-1 flex items-center justify-center border-2 border-white shadow-sm z-10 pointer-events-none animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <button
              onClick={toggleNotification}
              className={`w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-l2 flex items-center justify-center cursor-pointer transition-all hover:bg-l4 active:scale-95 ${isNotificationOpen ? 'border-primary shadow-sm' : ''}`}
              title="Notifications"
            >
              <span className="icon-notification text-[18px] lg:text-[20px] xl:text-[22px] text-g7"></span>
            </button>

            {/* Notification Dropdown Menu */}
            {isNotificationOpen && (
              <div className="absolute top-14 right-0 w-80 sm:w-96 bg-white border border-l2 rounded-2xl shadow-2xl z-40 overflow-hidden anim animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-l2 bg-l5/40">
                  <div className="flex items-center space-x-2">
                    <span className="text-15 font-semibold text-g1">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-11 bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-12 text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-l3">
                  {loadingNotif ? (
                    <div className="py-8 text-center text-g5 text-13">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-l4 flex items-center justify-center mb-2">
                        <span className="icon-notification text-[22px] text-g5"></span>
                      </div>
                      <p className="text-14 font-medium text-g3">No notifications</p>
                      <p className="text-12 text-g5 mt-0.5">You're completely up to date!</p>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const badge = getTypeBadge(item.type);
                      return (
                        <div
                          key={item._id}
                          onClick={() => handleNotificationClick(item)}
                          className={`flex items-start gap-3 p-3.5 hover:bg-l4/70 cursor-pointer transition-all ${!item.isRead ? 'bg-[#F0F7FF]/60' : ''}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base border ${badge.bg}`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-13 leading-snug line-clamp-1 ${!item.isRead ? 'font-semibold text-g1' : 'font-medium text-g2'}`}>
                                {item.title}
                              </p>
                              {!item.isRead && (
                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-1"></span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-12 text-g5 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                            <span className="text-[11px] text-g6 mt-1 block">
                              {item.createdAt ? moment(item.createdAt).fromNow() : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="border-t border-l2 p-2 bg-l5/30">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      navigate('/notification');
                    }}
                    className="w-full py-2 text-center text-13 font-semibold text-primary hover:bg-white rounded-xl transition-all block border border-transparent hover:border-l2"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-l4 transition-colors"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 bg-l3 rounded-full mx-auto overflow-hidden flex items-center justify-center border border-l2">
                {userDetails?.profile ? (
                  <img src={import.meta.env.VITE_BUCKET_URL + userDetails?.profile} alt="profile" className='object-cover w-full h-full' />
                ) : (
                  <span className="icon-user-fill text-[22px] md:text-[28px] text-g7"></span>
                )}
              </div>
              <span className="text-g1 font-medium hidden lg:block">{userDetails?.name}</span>
              <span className="icon-arrow-down text-g5 text-12"></span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-14 right-0 w-44 anim bg-white border border-l2 rounded-xl py-2 px-1.5 z-40 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-l4 transition-colors"
                  onClick={() => HandleOpenProfile()}
                >
                  <span className="icon-edit text-[16px] text-g1"></span>
                  <span className="text-13 font-medium text-g1">Edit Profile</span>
                </div>
                <div
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => setIsLogout(true)}
                >
                  <span className="icon-logout text-[16px] text-[#DC2626]"></span>
                  <span className="text-13 font-medium text-[#DC2626]">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {isLogout && <Logout onClose={() => setIsLogout(false)} />}
      {isProfileUpdate && <ProfileEdit onClose={HandleCloseProfile} />}
    </>
  );
};

export default Header;

