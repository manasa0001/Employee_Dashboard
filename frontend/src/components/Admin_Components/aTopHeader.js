import React, { useState, useEffect } from 'react';
import { FaUser, FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopHeader = ({ pageTitle, userName, profilePic, toggleSidebar }) => {
  const [userData, setUserData] = useState({ username: '', profilePic: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState([
    { message: 'Leave request approved', createdAt: new Date(), seen: false },
    { message: 'New policy update', createdAt: new Date(), seen: true }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, profilePic } = response.data;
        setUserData({
          username: name || '',
          profilePic: profilePic || '',
        });
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            navigate('/login');
          }
        } else {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    console.log('Profile clicked, navigating to /profile');
    navigate('/profile');
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      {/* Hamburger Icon and Page Title */}
      <div className="flex items-center gap-x-6 pl-4">
        <button
          onClick={() => {
            console.log('Icon clicked');
            if (typeof toggleSidebar === 'function') {
              toggleSidebar();
            } else {
              console.warn('toggleSidebar prop not provided or not a function!');
            }
          }}
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* Page Title */}
        <h2 className="text-xl font-bold text-gray-700">{pageTitle || 'Dashboard'}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <FaBell
            className="text-2xl text-gray-600 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg border border-gray-200 z-50 max-h-96 overflow-auto">
              <h3 className="p-3 border-b border-gray-200 font-semibold text-[#233876]">
                Notifications
              </h3>
              {notifications.length === 0 ? (
                <p className="p-3 text-gray-500">No new notifications</p>
              ) : (
                notifications.map((note, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-gray-100 text-sm ${
                      note.seen ? 'bg-white' : 'bg-blue-50 font-semibold'
                    }`}
                  >
                    <p>{note.message || 'Notification'}</p>
                    <small className="text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <button 
          onClick={handleProfileClick}
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none"
        >
          {userData.profilePic ? (
            <img
              src={
                profilePic && profilePic.startsWith('http')
                  ? profilePic
                  : profilePic
                  ? `http://localhost:5000${profilePic}`
                  : 'https://via.placeholder.com/150'
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-900"
            />
          ) : (
            <FaUser className="text-2xl text-gray-600" />
          )}
          <span className="text-gray-700 font-medium">{userData.username || ''}</span>
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
