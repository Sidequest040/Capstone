import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`));
            if (storedProfile && storedProfile.name) {
                setProfileName(storedProfile.name);
            }
            if (storedProfile && storedProfile.profilePicture) {
                setProfilePic(storedProfile.profilePicture);
            }
        }

        const handleStorageChange = () => {
            const updatedEmail = localStorage.getItem('email');
            const updatedProfile = JSON.parse(localStorage.getItem(`profile_${updatedEmail}`));
            if (updatedProfile && updatedProfile.name) {
                setProfileName(updatedProfile.name);
            }
            if (updatedProfile && updatedProfile.profilePicture) {
                setProfilePic(updatedProfile.profilePicture);
            }
        };

        window.addEventListener('storage', handleStorageChange);

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
        localStorage.removeItem('profile');
        localStorage.removeItem('email');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profilePicture');
        navigate('/login');
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Create an image element to resize
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const maxSize = 200; // Max size of the image (in pixels)
                    let width = img.width;
                    let height = img.height;

                    // Maintain aspect ratio and resize
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image to canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert the canvas to a data URL
                    const resizedImage = canvas.toDataURL('image/jpeg', 0.7); // Compress to 70% quality

                    const storedEmail = localStorage.getItem('email');
                    const updatedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`)) || {};
                    updatedProfile.profilePicture = resizedImage;
                    localStorage.setItem(`profile_${storedEmail}`, JSON.stringify(updatedProfile));

                    setProfilePic(resizedImage); // Update the profile picture in state
                };
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
                <h1>{profileName ? profileName : 'Guest'}</h1>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
