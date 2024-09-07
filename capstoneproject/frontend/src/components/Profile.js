import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        status: '',
        bio: '',
    });

    useEffect(() => {
        // Fetch user profile data from local storage or backend when component loads
        const fetchProfile = async () => {
            const storedProfile = JSON.parse(localStorage.getItem('profile'));
            if (storedProfile) {
                setProfile(storedProfile);
            } else {
                const response = await fetch('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/profile/1');
                const data = await response.json();
                setProfile(data);
                localStorage.setItem('profile', JSON.stringify(data)); // Save to local storage
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Update the profile on the backend
        const response = await fetch('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });
        if (response.ok) {
            alert('Profile updated successfully');
            localStorage.setItem('profile', JSON.stringify(profile)); // Save updated profile to local storage
            localStorage.setItem('profileName', profile.name); // Update the name in localStorage
        } else {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="profile-page">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={profile.status}
                        onChange={handleInputChange}
                        placeholder="Enter account status"
                    />
                </div>

                <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                <button type="submit" className="save-button">Save Profile</button>
            </form>
        </div>
    );
}

export default Profile;
