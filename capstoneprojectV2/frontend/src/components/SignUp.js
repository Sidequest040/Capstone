// src/components/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      // Check if the response has data before accessing it
      if (res && res.data) {
        setMessage(res.data.message); // Accessing the message safely
      } else {
        setMessage('Unexpected response from the server.');
      }

    } catch (error) {
      // Handling different error cases
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  // Function to navigate to the login page
  const goToLogin = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}

      {/* Add a button to go to the Login page */}
      <button onClick={goToLogin} style={{ marginTop: '10px' }}>Go to Login</button>
    </div>
  );
};

export default SignUp;
