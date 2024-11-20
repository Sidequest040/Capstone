import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Toast from './Toast'; // Import the Toast component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      // Save token and email to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);  // Save email

      setMessage('Login successful');
      setIsToastVisible(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.error || 'An error occurred. Please try again later.');
      setIsToastVisible(true);
    }
  };

  const handleCloseToast = () => {
    setIsToastVisible(false);
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email address"
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
          <button className="button" type="submit">Sign In</button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <button className="sign-up-link" onClick={goToSignUp}>Sign up</button>
        </div>
      </div>

      <Toast message={message} isVisible={isToastVisible} onClose={handleCloseToast} />
    </div>
  );
};

export default Login;
