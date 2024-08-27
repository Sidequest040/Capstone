import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [threats, setThreats] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/threats`)
            .then(response => {
                setThreats(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the threats:', error);
            });
    }, []);

    return (
        <div>
            <h1>Threat Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Detected At</th>
                    </tr>
                </thead>
                <tbody>
                    {threats.map(threat => (
                        <tr key={threat.id}>
                            <td>{threat.type}</td>
                            <td>{threat.description}</td>
                            <td>{threat.status}</td>
                            <td>{new Date(threat.detected_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
