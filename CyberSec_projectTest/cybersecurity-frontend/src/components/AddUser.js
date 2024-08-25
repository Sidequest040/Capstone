// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                username,
                password,
                role,
            });
            console.log('User added:', response.data);
            // Clear the form
            setUsername('');
            setPassword('');
            setRole('');
        } catch (error) {
            console.error('There was an error adding the user!', error);
        }
    };

    return (
        <div>
            <h1>Add User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
