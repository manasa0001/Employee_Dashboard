
// src/components/RedirectHandler.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReDirectHandler = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    if (token && role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (token && role === 'Employee') {
      navigate('/employee/dashboard');
    }
  }, [navigate, token, role]);

  return null; // nothing to render
};

export default RedirectHandler;
