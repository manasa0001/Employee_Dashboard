import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Appp.css'; 

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/employees/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="signin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSignin} className="signin-form" style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>Employee Sign In</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ marginBottom: '20px', padding: '10px', width: '100%' }} />
        <button type="submit" style={{ padding: '10px 20px', width: '100%', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Sign In</button>
      </form>
    </div>
  );
};

export default Signin;