import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setActiveSection }) {
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // New state for the search bar

    const sidebarItems = [
        { id: 'overview', label: 'Discover' },
        { id: 'technical', label: 'Technical Plans' },
        { id: 'threat-detection', label: 'Threat Detection' },
        { id: 'threat-detection-page', label: 'Run Threat Detection' },
        { id: 'help', label: 'Help' },
        { id: 'profile', label: 'Profile' },
        { id: 'dark-mode', label: 'Cyber Guardian' },
        { id: 'clearing-cache', label: 'Clearing Tool' },
    ];

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

        // Remove "active" class from all buttons
        const buttons = document.querySelectorAll("li");
        buttons.forEach(button => button.classList.remove("active"));

        // Find the specific section button and add "active" class
        const activeButton = document.querySelector(`#${section}`);
        if (activeButton) {
            activeButton.classList.add("active");
        } else {
            console.warn(`No button found with id "${section}"`);
        }
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
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const maxSize = 200;
                    let width = img.width;
                    let height = img.height;

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

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const resizedImage = canvas.toDataURL('image/jpeg', 0.7);

                    const storedEmail = localStorage.getItem('email');
                    const updatedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`)) || {};
                    updatedProfile.profilePicture = resizedImage;
                    localStorage.setItem(`profile_${storedEmail}`, JSON.stringify(updatedProfile));

                    setProfilePic(resizedImage);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredItems = sidebarItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="sidebar">
            <input
                type="text"
                placeholder="Search"
                value={searchQuery} // Bind input to state
                onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
            />
            <ul>
                {filteredItems.map((item) => (
                    <li
                        key={item.id}
                        id={item.id}
                        className={item.id === 'overview' ? 'active' : ''}
                        onClick={() => handleButtonClick(item.id)}
                    >
                        {item.label}
                    </li>
                ))}
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
