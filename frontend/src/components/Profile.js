
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(true);
  const userId = "67fdd570214a9c9a4cc2b075";

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          profilePic: res.data.profilePic || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (!userId) return;

    axios
      .put(`http://localhost:5000/api/users/${userId}`, formData)
      .then(() => {
        alert("User updated successfully");
      })
      .catch((err) => {
        console.error("Update Error:", err);
        alert("Update failed");
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    axios
      .post("http://localhost:5000/api/upload", imageData)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          profilePic: res.data.url,
        }));
      })
      .catch((err) => {
        console.error("Image upload failed:", err);
      });
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg shadow-blue-900">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopHeader
          userName={`${formData.firstName} ${formData.lastName}`}
          pageTitle="Profile"
        />

        <div className="flex-1 p-6 bg-white">
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
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-800"
                />
              </div>

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
    </div>
  );
};

export default Profile;
