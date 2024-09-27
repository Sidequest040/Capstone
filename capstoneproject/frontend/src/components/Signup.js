// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/signup`, {
                username,
                email,
                password,
            });
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error('There was an error signing up!', error);
            alert('An error occurred while signing up. Please try again later.');
        }
    };

    return (
        <>
            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input"
                />
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
                <button type="submit" className="button">Sign Up</button>
                <button
                    type="button"
                    className="button"
                    onClick={() => navigate('/login')}
                >
                    Already have an account? Log in
                </button>
            </form>
        </>
    );
}

export default Signup;
