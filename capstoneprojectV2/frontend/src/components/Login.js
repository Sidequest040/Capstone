// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for redirecting

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token); // Store the JWT token
      setMessage('Login successful');
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  // Function to navigate back to Sign Up
  const goToSignUp = () => {
    navigate('/');  // Redirect to the sign-up page
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}

      {/* Add a button to go to the Sign-Up page */}
      <button onClick={goToSignUp} style={{ marginTop: '10px' }}>Go to Sign Up</button>
    </div>
  );
};

export default Login;
