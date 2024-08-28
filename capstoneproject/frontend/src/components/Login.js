import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Importing the CSS file

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);  // State for controlling the modal visibility
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/login', { email, password });
            if (response.data.token) {
                // Show the modal
                setShowModal(true);

                // Store the token in local storage or a context for later use
                localStorage.setItem('token', response.data.token);

                // Hide the modal and navigate to the dashboard after a shorter delay
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/dashboard');
                }, 1000);  // Reduce delay to 1 second
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Invalid credentials. Please try again.');
            } else {
                console.error('There was an error logging in!', error);
                alert('An error occurred while logging in. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="login-input"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
                <button 
                    type="button" 
                    className="signup-button" 
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>
            </form>

            {showModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <h3>Login Successful!</h3>
                        <p>Welcome back! Redirecting to your dashboard...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
