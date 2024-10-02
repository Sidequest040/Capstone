import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing Login.css for styles

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      if (res && res.data) {
        setMessage(res.data.message);
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button" type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
        <div className="login-footer">
          <span>Already have an account?</span>
          <button className="sign-up-link" onClick={goToLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
