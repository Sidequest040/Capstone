import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState(''); // Default is empty
    const [profilePic, setProfilePic] = useState('');   // For storing profile picture

    useEffect(() => {
        // Fetch profile name and picture based on the logged-in user's email
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`));
            if (storedProfile && storedProfile.name) {
                setProfileName(storedProfile.name); // Set the user's profile name
            }
            if (storedProfile && storedProfile.profilePicture) {
                setProfilePic(storedProfile.profilePicture); // Set the user's profile picture
            }
        }

        // Set up an event listener to update the name and picture when they change in localStorage
        const handleStorageChange = () => {
            const updatedEmail = localStorage.getItem('email');
            const updatedProfile = JSON.parse(localStorage.getItem(`profile_${updatedEmail}`));
            if (updatedProfile && updatedProfile.name) {
                setProfileName(updatedProfile.name); // Update the sidebar when the profile name changes
            }
            if (updatedProfile && updatedProfile.profilePicture) {
                setProfilePic(updatedProfile.profilePicture); // Update the profile picture
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
        localStorage.removeItem('profilePicture'); // Clear stored profile picture
        navigate('/login');
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const storedEmail = localStorage.getItem('email');
                const updatedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`)) || {};
                updatedProfile.profilePicture = reader.result;
                localStorage.setItem(`profile_${storedEmail}`, JSON.stringify(updatedProfile));
                setProfilePic(reader.result); // Update the profile picture in state
            };
            reader.readAsDataURL(file);
        }
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
                <label htmlFor="profilePicUpload">
                    <img
                        src={profilePic ? profilePic : 'https://pbs.twimg.com/profile_images/994592419705274369/RLplF55e.jpg'}
                        alt="Profile Pic"
                        style={{ cursor: 'pointer' }}
                    />
                </label>
                <input
                    id="profilePicUpload"
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                />
                <h1>{profileName ? profileName : 'Guest'}</h1> {/* Fallback to 'Guest' if no profile name */}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
