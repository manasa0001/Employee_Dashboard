

import React from "react";
import { FaHome, FaCalendarAlt, FaClock, FaHouseUser, FaTasks, FaTools, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Appp.css";

const Sidebar = () => {
const navigate = useNavigate();

const handleSignout = () => {
localStorage.clear();
navigate('/signin');
};

return ( <div className="sidebar"> <div className="logo"> <h2>Employee Dashboard</h2> </div> <ul className="nav-links"> <li><Link to="/" className="nav-link"><FaHome className="icon" /> Dashboard</Link></li> <li><Link to="/profile" className="nav-link"><FaUser className="icon" /> Profile</Link></li> <li><Link to="/calendar" className="nav-link"><FaCalendarAlt className="icon" /> Calendar</Link></li> <li><Link to="/attendance" className="nav-link"><FaClock className="icon" /> Attendance</Link></li> <li><Link to="/leave" className="nav-link"><FaHouseUser className="icon" /> Leave</Link></li> <li><Link to="/tasks" className="nav-link"><FaTasks className="icon" /> Tasks</Link></li> <li><Link to="/settings" className="nav-link"><FaTools className="icon" /> Settings</Link></li> </ul>
<div className="signout-section" style={{ marginTop: 'auto' }}>
<button onClick={handleSignout} className="nav-link" style={{ color: '#fff', background: 'none', border: 'none', padding: '15px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}> <FaSignOutAlt className="icon" /> \<span style={{ marginLeft: '10px' }}>Sign Out</span> </button> </div> </div>
);
};

export default Sidebar; 
