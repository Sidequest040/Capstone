import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function ThreatDetection() {
    const [filterCritical, setFilterCritical] = useState(false);
    const [filterToday, setFilterToday] = useState(false);

    // Example data; replace with actual data as needed
    const allData = [
        { time: '00:00', threats: 2, critical: true, date: '2024-08-27' },
        { time: '01:00', threats: 3, critical: false, date: '2024-08-27' },
        { time: '02:00', threats: 5, critical: true, date: '2024-08-28' },
        { time: '03:00', threats: 1, critical: false, date: '2024-08-28' },
        { time: '04:00', threats: 6, critical: true, date: '2024-08-28' },
        { time: '05:00', threats: 4, critical: false, date: '2024-08-28' },
        { time: '06:00', threats: 7, critical: true, date: '2024-08-28' },
        { time: '07:00', threats: 5, critical: false, date: '2024-08-28' },
    ];

    const today = '2024-08-28'; // Replace with dynamic date as needed

    // Filter data based on selected options
    const filteredData = allData.filter(item => {
        if (filterCritical && !item.critical) return false;
        if (filterToday && item.date !== today) return false;
        return true;
    });

    return (
        <div>
            <h2>Threat Detection</h2>
            <p>Monitor and analyze detected threats in real-time.</p>

            <div className="chart-container">
                <h3>Threats Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="threats" stroke="#ff7300" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="logs-container">
                <h3>Real-Time Threat Logs</h3>
                <div className="logs-box">
                    {filteredData.map((item, index) => (
                        <p key={index}>[{item.time}] Threat detected with {item.threats} occurrences.</p>
                    ))}
                </div>
            </div>

            <div className="filter-container">
                <h3>Filter Logs</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={filterCritical}
                        onChange={() => setFilterCritical(!filterCritical)}
                    />
                    Show only critical threats
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={filterToday}
                        onChange={() => setFilterToday(!filterToday)}
                    />
                    Show only today's logs
                </label>
            </div>
        </div>
    );
}

export default ThreatDetection;
