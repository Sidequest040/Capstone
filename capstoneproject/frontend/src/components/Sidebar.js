import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState('Jimmy Donaldson'); // Default value

    // Fetch the profile name from localStorage when the component mounts
    useEffect(() => {
        const storedName = localStorage.getItem('profileName');
        if (storedName) {
            setProfileName(storedName);
        }
    }, []);

    const handleButtonClick = (section) => {
        setActiveSection(section);

        const buttons = document.querySelectorAll("li");
        buttons.forEach(button => button.classList.remove("active"));
        document.querySelector(`#${section}`).classList.add("active");
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear authentication token
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <input type="text" placeholder="Search" />
            <ul>
                <li id="overview" className="active" onClick={() => handleButtonClick('overview')}>Discover</li>
                <li id="technical" onClick={() => handleButtonClick('technical')}>Technical Plans</li>
                <li id="threat-detection" onClick={() => handleButtonClick('threat-detection')}>Threat Detection</li>
                <li id="threat-detection-page" onClick={() => handleButtonClick('threat-detection-page')}>Run Threat Detection</li>
                <li id="help" onClick={() => handleButtonClick('help')}>Help</li>
                <li id="profile" onClick={() => handleButtonClick('profile')}>Profile</li>
                <li id="app" onClick={() => handleButtonClick('app')}>Dark Mode</li>
            </ul>
            <div className="profile">
                <img src="https://pbs.twimg.com/profile_images/994592419705274369/RLplF55e.jpg" alt="Profile Pic" />
                <h1>{profileName}</h1> {/* Dynamically display the profile name */}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
