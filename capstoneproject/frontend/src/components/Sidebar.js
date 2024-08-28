import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();

    const handleButtonClick = (section) => {
        setActiveSection(section);

        const buttons = document.querySelectorAll("li");
        buttons.forEach(button => button.classList.remove("active"));
        document.querySelector(`#${section}`).classList.add("active");
    };

    const handleLogout = () => {
        // Logic for logout, e.g., clearing user data
        localStorage.removeItem('authToken');  // Example: removing token from localStorage

        // Redirect to the login page
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <input type="text" placeholder="Search" />
            <ul>
                <li id="overview" className="active" onClick={() => handleButtonClick('overview')}>Discover</li>
                <li id="technical" onClick={() => handleButtonClick('technical')}>Technical Plans</li>
                {/* Add more buttons for different sections */}
            </ul>
            <div className="profile">
                <img src="https://pbs.twimg.com/profile_images/994592419705274369/RLplF55e.jpg" alt="Profile Pic" />
                <h1>Jimmy Donaldson</h1>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
