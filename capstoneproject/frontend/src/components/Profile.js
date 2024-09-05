import React from 'react';
import './Profile.css';

function Profile() {
    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            <div className="profile-info">
                <p>Welcome, [User Name]</p>
                <p>Threat Detections Run: 12</p>
                <p>Account Status: Active</p>
                <button>Edit Profile</button>
            </div>
            <div className="activity-logs">
                <h2>Recent Activities</h2>
                <ul>
                    <li>[Date] - Threat Detection Run</li>
                    <li>[Date] - Profile Updated</li>
                    <li>[Date] - New Badge Earned: Expert</li>
                </ul>
            </div>
        </div>
    );
}

export default Profile;
