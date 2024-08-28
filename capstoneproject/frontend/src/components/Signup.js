import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Reusing the same CSS file for consistency

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/signup', { 
                username, 
                email, 
                password 
            });
            alert(response.data.message);
            navigate('/login');  // Redirect to login after successful signup
        } catch (error) {
            console.error('There was an error signing up!', error);
        }
    };     

    return (
        <div className="login-container">
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
                <button type="submit" className="login-button">Signup</button>
            </form>
        </div>
    );
}

export default Signup;
