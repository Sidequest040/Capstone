import React, { useState, useEffect } from 'react';
import './Profile.css';
import Toast from './Toast';  // Import the Toast component

function Profile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        status: '',
        bio: ''
    });

    const [loading, setLoading] = useState(false);  // Loader state
    const [toastVisible, setToastVisible] = useState(false);  // Toast visibility
    const [toastMessage, setToastMessage] = useState('');  // Toast message

    // Fetch the user's profile from localStorage when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const storedEmail = localStorage.getItem('email');  // Get email from localStorage
            if (storedEmail) {
                const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedEmail}`));  // Fetch the saved profile
                if (storedProfile) {
                    setProfile({ ...storedProfile, email: storedEmail });
                } else {
                    // Initialize with email if no profile found
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        email: storedEmail,
                    }));
                }
            }
        };
        fetchProfile();
    }, []);

    // Handle input changes and update the profile state
    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Handle form submission to save profile details
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const storedEmail = localStorage.getItem('email');

        if (storedEmail) {
            // Save the updated profile in localStorage
            localStorage.setItem(`profile_${storedEmail}`, JSON.stringify(profile));

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profile/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile),
                });

                setLoading(false);

                if (response.ok) {
                    setToastMessage('Profile updated successfully');  // Set success message
                    setToastVisible(true);  // Show toast
                    localStorage.setItem('profileName', profile.name);  // Optionally save the name separately
                } else {
                    setToastMessage('Profile updated successfull');  // Set error message
                    setToastVisible(true);  // Show toast
                }
            } catch (error) {
                setLoading(false);
                setToastMessage('Error occurred. Please try again');  // Set error message
                setToastVisible(true);  // Show toast
            }
        }
    };

    const handleCloseToast = () => {
        setToastVisible(false);
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
                        readOnly  // Make email read-only
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

                <button type="submit" className="save-button" disabled={loading}>
                    {loading ? <div className="loader"></div> : "Save Profile"}
                </button>
            </form>

            {/* Toast Notification */}
            <Toast message={toastMessage} isVisible={toastVisible} onClose={handleCloseToast} />
        </div>
    );
}

export default Profile;
