import React, { useContext, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';
import { ThreatContext } from './ThreatContext';

function ThreatDetection() {
    const { threatData } = useContext(ThreatContext);

    const [filterCritical, setFilterCritical] = useState(false);
    const [filterToday, setFilterToday] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [pieData, setPieData] = useState([]);

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        // Filter data based on user preferences
        const data = threatData.filter(item => {
            if (filterCritical && !item.critical) return false; // Filter by critical threats
            if (filterToday && item.date !== today) return false;
            return true;
        });

        setFilteredData(data);

        // Aggregate occurrences of threats by IP address for the PieChart
        const ipThreats = {};
        data.forEach(item => {
            if (!ipThreats[item.ip]) {
                ipThreats[item.ip] = 0;
            }
            ipThreats[item.ip] += item.threats; // Add up the occurrences of threats
        });

        // Convert the aggregated IP threat data into a format usable by PieChart
        const pieChartData = Object.keys(ipThreats).map(ip => ({
            name: ip,
            value: ipThreats[ip],
        }));

        console.log("PieChart Data:", pieChartData);  // Log the pie chart data for debugging
        setPieData(pieChartData);
    }, [filterCritical, filterToday, threatData, today]);

    // Colors for PieChart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Default data if there is no data to show in the PieChart
    const defaultPieData = [{ name: 'No Data', value: 1 }];

    return (
        <div>
            <h2>Threat Detection</h2>
            <p>Monitor and analyze detected threats in real-time.</p>

            {/* Line Chart for Threats Over Time */}
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

            {/* Pie Chart for Harmful IPs */}
            <div className="chart-container">
                <h3>Most Harmful IPs</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData.length > 0 ? pieData : defaultPieData}  // Fallback data if no pieData
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {(pieData.length > 0 ? pieData : defaultPieData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Logs of Threats */}
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

            {/* Filter Options */}
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
