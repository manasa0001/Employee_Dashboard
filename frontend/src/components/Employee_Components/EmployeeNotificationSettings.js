
import React, { useState } from 'react';
import axios from 'axios';

const EmployeeNotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/users/notification-settings',
        { emailNotifications, smsNotifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center p-10">
      <div className=" mb-24 bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-12 border border-gray-200 h-[50vh]">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Notification Preferences
        </h2>

        <div className="space-y-8">
          <ToggleSetting
            label="Email Notifications"
            value={emailNotifications}
            onToggle={() => setEmailNotifications(!emailNotifications)}
          />

          <ToggleSetting
            label="SMS Notifications"
            value={smsNotifications}
            onToggle={() => setSmsNotifications(!smsNotifications)}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
          >
            Save Settings
          </button>
        </div>

        {message && <p className="text-green-600 mt-6 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
      </div>
    </div>
  );
};

// ✅ Toggle switch with blue ON color
const ToggleSetting = ({ label, value, onToggle }) => {
  return (
    <div className="flex items-center justify-between text-lg font-medium text-gray-700">
      <span>{label}</span>
      <div
        onClick={onToggle}
        className={`w-16 h-9 flex items-center rounded-full p-1 cursor-pointer transition-all ${
          value ? 'bg-blue-600' : 'bg-gray-400'
        }`}
      >
        <div
          className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform ${
            value ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export default EmployeeNotificationSettings;
