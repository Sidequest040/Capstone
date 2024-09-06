import React, { useState } from 'react';
import './CyberGuardian.css';

function CyberGuardian() {
    const [darkMode, setDarkMode] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    const toggleAlert = () => {
        setShowAlert(!showAlert);
    };

    return (
        <div className={`CyberGuardian ${darkMode ? 'dark-mode' : ''}`}>
            <header className="CyberGuardian-header">
                <button className="toggle-mode-button" onClick={toggleDarkMode}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                <button className="toggle-alert-button" onClick={toggleAlert}>
                    {showAlert ? 'Hide Security Alert' : 'Show Security Alert'}
                </button>

                {showAlert && (
                    <div className="security-alert">
                        <p>⚠️ Potential threat detected in your network! Take immediate action.</p>
                    </div>
                )}
            </header>
        </div>
    );
}

export default CyberGuardian;
