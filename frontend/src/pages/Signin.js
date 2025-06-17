
import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import icon from '../assets/icon.png';

const Signin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('employee'); // 'admin' or 'employee'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleToggle = () => setIsRegister(!isRegister);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    try {
      const payload = isRegister
        ? { ...formData, role }
        : { email: formData.email, password: formData.password, role };

      const res = await axios.post(url, payload);

      if (!isRegister) {
  const { token, role, name, userId } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('userRole', role.toLowerCase());
  localStorage.setItem('username', name);
  localStorage.setItem('userId', userId); // ✅ correct variable

        if (role === 'admin') {
          console.log('Navigating to admin dashboard');
          window.location.href = '/admin/dashboard';

        } else {
          console.log('Navigating to employee dashboard');
          window.location.href = '/employee/dashboard';

        }

      } else {
        alert('Registered successfully! Please login.');
        setIsRegister(false);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-gradient-to-r from-blue-950 to-blue-950 flex flex-col items-center justify-start">
      {/* Header */}
      <div className="w-full bg-white py-6 px-8 flex items-center justify-start shadow-md">
        <img src={logo} alt="KodeBloom Logo" className="w-56 h-auto" />
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white text-black p-8 rounded-xl shadow-lg border-t-4 border-blue-950">
          {/* Role Switch */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setRole('employee')}
              className={`w-1/2 py-2 font-semibold rounded-l-lg ${
                role === 'employee' ? 'bg-blue-950 text-white' : 'bg-gray-200'
              }`}
            >
              Employee
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`w-1/2 py-2 font-semibold rounded-r-lg ${
                role === 'admin' ? 'bg-blue-950 text-white' : 'bg-gray-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <img src={icon} alt="User Icon" className="w-16 h-16 rounded-full border-2 border-blue-950" />
          </div>

          {/* Header */}
          <h2 className="text-center text-2xl font-semibold mb-2">
            {isRegister ? 'Register' : 'Login'}
          </h2>
          <p className="text-center text-gray-500 mb-6">
            {isRegister ? 'Create a new account' : 'Welcome back!'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />


            <button
              type="submit"
              className="w-full bg-blue-950 text-white py-2 rounded-lg hover:bg-blue-950 transition"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {isRegister ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <button
              onClick={handleToggle}
              className="text-blue-950 hover:underline font-semibold"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-5 text-sm text-white text-center bg-blue-950">
        © 2025 KodeBloom. All rights reserved.
      </div>
    </div>
  );
};

export default Signin;
