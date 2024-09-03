import React, { useContext, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { ThreatContext } from './ThreatContext';

function ThreatDetection() {
    const { threatData } = useContext(ThreatContext);

    const [filterCritical, setFilterCritical] = useState(false);
    const [filterToday, setFilterToday] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const data = threatData.filter(item => {
            if (filterCritical && !item.critical) return false; // Filter by critical threats
            if (filterToday && item.date !== today) return false;
            return true;
        });
        setFilteredData(data);
    }, [filterCritical, filterToday, threatData, today]);

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
                        <p key={index}>
                            [{item.time}] Threat detected with {item.threats} occurrences from IP {item.ip}. 
                            {item.critical && <strong> (Critical)</strong>}
                        </p>
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
