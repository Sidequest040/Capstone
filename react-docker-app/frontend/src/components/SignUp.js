import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';  // Make sure the path is correct for the styles

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

async function signupUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',  // Include credentials (cookies) for session
    });

    // Check if response is ok and parse JSON
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error(err);  // Log the error for debugging
    return { success: false, message: err.message };
  }
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading state

    const response = await signupUser({
      email,
      password,
    });

    setLoading(false);  // Stop loading state

    if (response.success) {
      console.log('Signup successful!');
      setMessage('Signup successful! You can now login.');
    } else {
      setMessage(response.message || 'Signup failed, please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && <p>{message}</p>}
        <p className="login-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}
