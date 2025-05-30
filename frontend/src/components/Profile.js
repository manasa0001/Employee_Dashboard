

// src/components/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import TopHeader from "./TopHeader";
import Sidebar from "./Sidebar";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePic: "",
  });
 const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 1️⃣ Fetch “me” to get ID and initial profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return setLoading(false);
    }

    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { userId, name, email, phone, address, profilePic } =
          res.data;
        setUserId(userId);
        setFormData({
          name : name || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          profilePic: profilePic || "",
        });
        localStorage.setItem("userPic", profilePic);
      })
      .catch((err) => {
        console.error("Fetch /me error:", err);
        setError("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // 2️⃣ Update form data on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Updated image upload
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const storedUserId = localStorage.getItem('userId');

  if (!storedUserId) {
    alert("User not logged in. Please sign in again.");
    return;
  }
  const imageData = new FormData();
  imageData.append("profilePic", file); // 👈 Must match multer field
  imageData.append("userId", storedUserId); // 👈 Send user ID too

  axios
    .post("http://localhost:5000/api/auth/upload-profile-pic", imageData)
    .then((res) => {
      setFormData((prev) => ({
        ...prev,
        profilePic: `/uploads/${res.data.filename}`
      }));
    })
    .catch((err) => {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    });
};

// Updated profile update handler
const handleUpdate = async () => {
  if (!userId) {
    console.warn("User ID not available for update");
    return;
  }
  console.log("Attempting to update user:", userId);
  console.log("Data:", formData);
  setLoading(true);

  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(res.data.message || "Updated successfully");
  } catch (err) {
    console.error ("Update Error:", err);
    alert ("Update failed");
  } finally {
    setLoading(false);
  }
};

  if (loading)
    return <div className="text-center p-6">Loading profile…</div>;
  if (error)
    return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="relative min-h-screen w-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              closeSidebar={closeSidebar}
            />

      <div className={`w-64 bg-white shadow-lg shadow-blue-900 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
  {/* Sidebar content */}
</div>
      {/* Main Content */}
      <div className=" h-screen w-full flex-1 flex flex-col">
        <TopHeader
          userName= {formData.name}
          profilePic={formData.profilePic}
          pageTitle="Profile"
          toggleSidebar={toggleSidebar}
        />
<div className="flex-1 p-6 bg-gray-100">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md shadow-blue-300"
              alt="Profile"
              src={
                formData.profilePic
                  ? `http://localhost:5000${formData.profilePic}`
                  : "https://via.placeholder.com/150"
              }
            />
          </div>

          {/* Vertical Form */}
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl shadow-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Edit Profile
            </h2>

            <div className="space-y-5">
  {/** Name */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">
      Name
    </label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
    />
  </div>
</div>

              {/** Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
                />
              </div>

              {/** Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
                />
              </div>

              {/** Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
                />
              </div>

              {/** Profile Picture Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleUpdate}
                className="bg-white text-blue-900 border border-blue-900 px-6 py-2 rounded shadow-md shadow-blue-900 hover:bg-blue-900 hover:text-white transition duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;
