import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection
import './Login.css'; // Ensure this path is correct to apply styles

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',  // Include credentials (cookies) for session
    });

    // Check if the response is ok and parse JSON
    if (!response.ok) {
      const errorData = await response.json(); // get the error message from backend
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login Error:', error.message);
    return { message: error.message };
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading state

    const response = await loginUser({
      email,
      password,
    });

    setLoading(false);  // Stop loading state

    if (response.message === 'Login successful') {
      console.log('Login successful!');
      setMessage('Login successful! Redirecting...');

      // Store token or userId in localStorage for authentication
      localStorage.setItem('token', response.userId); // Storing userId as token for simplicity

      // Redirect to Dashboard after successful login
      navigate('/dashboard');
    } else {
      setMessage(response.message || 'Login failed, please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required  // Ensures that the input is required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required  // Ensures that the input is required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p>{message}</p>}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}
