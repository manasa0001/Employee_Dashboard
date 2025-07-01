import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Admin_Components/aSidebar";
import TopHeader from "../components/Admin_Components/aTopHeader";
import '../styles/asecProfile.css';

function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    address: ''
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Initialize user data
  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const pic = localStorage.getItem("userPic");

    if (username && token) {
      setUsername(username);
      setProfilePic(pic || "");
      // Pre-fill form with user data if available
      setFormData(prev => ({
        ...prev,
        fullName: localStorage.getItem("fullName") || '',
        email: localStorage.getItem("email") || '',
        contactNumber: localStorage.getItem("contactNumber") || '',
        address: localStorage.getItem("address") || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage (replace with API call in real app)
    localStorage.setItem("fullName", formData.fullName);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("contactNumber", formData.contactNumber);
    localStorage.setItem("address", formData.address);
    
    console.log('Profile data saved:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="relative min-h-screen w-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Header */}
        <TopHeader
          pageTitle="Profile Settings"
          userName={username}
          profilePic={profilePic}
          toggleSidebar={toggleSidebar}
        />

        {/* Profile Content */}
        <div className="flex-1 p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="profile-container bg-white rounded-lg shadow-md p-8">
              <h1 className="profile-header text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>
              
              <div className="profile-section">
                <h2 className="section-title text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name..."
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email..."
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your mobile number..."
                      value={formData.contactNumber}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your present house address..."
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      onClick={() => navigate(-1)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;