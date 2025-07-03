import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/board';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
  <div className="auth-wrapper">
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Collab-ToDo Login</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Log In</button>
      {error && <p className="error-msg">{error}</p>}
      <p className="switch-auth">
        New here? <a href="/register">Create an account</a>
      </p>
    </form>
  </div>
  );
};

export default Login;

