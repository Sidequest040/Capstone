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
        // Fetch user profile data for the logged-in user
        const fetchProfile = async () => {
            const storedEmail = localStorage.getItem('email'); // Get the logged-in user's email

            // If the user is new (no profile data stored), start with an empty profile
            if (storedEmail) {
                const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`));

                if (storedProfile) {
                    setProfile({ ...storedProfile, email: storedEmail });
                } else {
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        email: storedEmail, // Prefill the email
                    }));
                }
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedEmail = localStorage.getItem('email');

        // Save the updated profile to local storage for this specific user
        if (storedEmail) {
            localStorage.setItem(`profile_${storedEmail}`, JSON.stringify(profile)); // Save profile data using the user's email as a key

            // Optionally, make an API request to update the profile in the backend as well
            const response = await fetch('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                alert('Profile updated successfully');
                localStorage.setItem('profileName', profile.name); // Update the name in localStorage for other components to access
            } else {
                alert('Failed to update profile');
            }
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
                        readOnly // Email is read-only, as it's tied to the account
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
