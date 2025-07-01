import React from 'react';
import Sidebar from "../components/Admin_Components/aSidebar";
import TopHeader from "../components/Admin_Components/aTopHeader";
import { useNavigate } from 'react-router-dom';

function UpdateSecurityQuestions() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("userPic");

  return (
    <div className="min-h-screen w-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <TopHeader
          pageTitle="Update Security Questions"
          userName={username}
          profilePic={profilePic}
        />
        <div className="p-8">
          <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Update Security Questions</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Security Question 1</label>
                <input className="w-full border p-2 rounded mt-1" type="text" placeholder="e.g. What was your first pet’s name?" />
              </div>
              <div>
                <label className="block text-gray-700">Answer 1</label>
                <input className="w-full border p-2 rounded mt-1" type="text" />
              </div>
              <div>
                <label className="block text-gray-700">Security Question 2</label>
                <input className="w-full border p-2 rounded mt-1" type="text" placeholder="e.g. What is your favorite movie?" />
              </div>
              <div>
                <label className="block text-gray-700">Answer 2</label>
                <input className="w-full border p-2 rounded mt-1" type="text" />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateSecurityQuestions;
