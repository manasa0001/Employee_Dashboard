import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Appp.css';

const TopHeader = ({ pageTitle }) => {
  const [userData, setUserData] = useState({ username: '', profilePic: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); 

      if (!token) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUserData({
            username: response.data.username,
            profilePic: response.data.profilePic,
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Token expired or unauthorized');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="top-header">
      <h2>{pageTitle || "Dashboard"}</h2>
      <div className="user-profile" onClick={goToProfile} style={{ cursor: 'pointer' }}>
        {userData.profilePic ? (
          <img src={userData.profilePic} alt="Profile" className="avatar" />
        ) : (
          <FaUser className="avatar" />
        )}
        <span>{userData.username || ""}</span>
      </div>
    </div>
  );
};

export default TopHeader;
