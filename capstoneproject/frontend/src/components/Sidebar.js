import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState(''); // Default is empty

    useEffect(() => {
        // Fetch profile name based on the logged-in user's email
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`));
            if (storedProfile && storedProfile.name) {
                setProfileName(storedProfile.name); // Set the user's profile name
            }
        }

        // Set up an event listener to update the name when it changes in localStorage
        const handleStorageChange = () => {
            const updatedEmail = localStorage.getItem('email');
            const updatedProfile = JSON.parse(localStorage.getItem(`profile_${updatedEmail}`));
            if (updatedProfile && updatedProfile.name) {
                setProfileName(updatedProfile.name); // Update the sidebar when the profile name changes
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleButtonClick = (section) => {
        setActiveSection(section);

        const buttons = document.querySelectorAll("li");
        buttons.forEach(button => button.classList.remove("active"));
        document.querySelector(`#${section}`).classList.add("active");
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('profile');  // Remove profile data
        localStorage.removeItem('email');    // Remove email
        localStorage.removeItem('profileName'); // Clear stored name
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
                <li id="dark-mode" onClick={() => handleButtonClick('dark-mode')}>Dark Mode</li>
            </ul>
            <div className="profile">
                <img src="https://pbs.twimg.com/profile_images/994592419705274369/RLplF55e.jpg" alt="Profile Pic" />
                <h1>{profileName ? profileName : 'Guest'}</h1> {/* Fallback to 'Guest' if no profile name */}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
