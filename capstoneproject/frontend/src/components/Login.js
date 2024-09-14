import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load the Spline viewer script
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@splinetool/viewer@1.9.26/build/spline-viewer.js";
        script.type = "module";
        document.body.appendChild(script);

        // Once the Spline viewer script is loaded, start observing the shadow DOM
        script.onload = () => {
            const observer = new MutationObserver(() => {
                const splineViewer = document.querySelector('spline-viewer');
                if (splineViewer && splineViewer.shadowRoot) {
                    const logo = splineViewer.shadowRoot.querySelector('#logo');
                    if (logo) {
                        // Hide the watermark
                        logo.style.display = 'none'; 
                    }
                }
            });

            // Observe the Spline viewer for changes
            observer.observe(document.body, { childList: true, subtree: true });
        };

        // Fallback in case the MutationObserver fails
        setTimeout(() => {
            const splineViewer = document.querySelector('spline-viewer');
            if (splineViewer && splineViewer.shadowRoot) {
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.style.display = 'none';
                }
            }
        }, 100); // Wait for 2 seconds before trying to remove watermark manually
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/login', { email, password });
            if (response.data.token) {
                setShowModal(true);

                // Store the token and email in local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);  // Store the email

                setTimeout(() => {
                    setShowModal(false);
                    navigate('/dashboard');
                }, 1000);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Invalid credentials. Please try again.');
            } else {
                alert('An error occurred while logging in. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            {/* Spline Viewer */}
            <spline-viewer url="https://prod.spline.design/BNNmZnDI0vpUHDOQ/scene.splinecode"></spline-viewer>

            {/* Login Form */}
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
