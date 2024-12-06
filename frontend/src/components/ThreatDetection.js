import React, { useContext, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';
import { ThreatContext } from './ThreatContext';

function ThreatDetection() {
    const { threatData } = useContext(ThreatContext);

    const [filterCritical, setFilterCritical] = useState(false);
    const [selectedIP, setSelectedIP] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Removed 'useEffect' and 'today' since they were not used.
    // If you need to filter by today's date specifically, reintroduce and use it:
    // const today = new Date().toISOString().slice(0, 10);

    // Generate a list of unique IPs for filtering
    const uniqueIPs = useMemo(() => {
        const ips = threatData.map(item => item.ip);
        return ['All', ...new Set(ips)];
    }, [threatData]);

    // Filter logic
    const filteredData = useMemo(() => {
        return threatData.filter(item => {
            // Critical filter
            if (filterCritical && !item.critical) return false;
            // IP filter
            if (selectedIP !== 'All' && item.ip !== selectedIP) return false;

            // Date range filter
            const itemDate = item.date;
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;

            return true;
        });
    }, [threatData, filterCritical, selectedIP, startDate, endDate]);

    // Aggregate occurrences of threats by IP address for the PieChart
    const pieData = useMemo(() => {
        const ipThreats = {};
        filteredData.forEach(item => {
            if (!ipThreats[item.ip]) {
                ipThreats[item.ip] = 0;
            }
            ipThreats[item.ip] += item.threats;
        });
        const entries = Object.entries(ipThreats);
        if (entries.length === 0) {
            return [{ name: 'No Data', value: 1 }];
        }
        return entries.map(([ip, value]) => ({ name: ip, value }));
    }, [filteredData]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

    // Custom label for PieChart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '12px' }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom tooltip for PieChart
    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            return (
                <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '5px', color: '#fff' }}>
                    <strong>{name}</strong>: {value} occurrences
                </div>
            );
        }
        return null;
    };

    // Custom Legend formatter to show IP and total threats
    const renderLegendText = (value, entry) => {
        const { payload } = entry;
        return <span style={{ color: '#fff' }}>{value} ({payload.value})</span>;
    };

    return (
        <div className="threat-detection-page">
            <h2>Threat Detection</h2>
            <p>Monitor and analyze detected threats in real-time.</p>

            {/* Filter Section */}
            <div className="filter-panel">
                <h3>Filters</h3>
                <div className="filter-controls">
                    <div className="filter-group">
                        <label>IP Filter:</label>
                        <select value={selectedIP} onChange={e => setSelectedIP(e.target.value)}>
                            {uniqueIPs.map(ip => (
                                <option key={ip} value={ip}>{ip}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Start Date:</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>End Date:</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div className="filter-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={filterCritical}
                                onChange={() => setFilterCritical(!filterCritical)}
                            />
                            Show only critical threats
                        </label>
                    </div>
                </div>
            </div>

            {/* Line Chart for Threats Over Time */}
            <div className="chart-container">
                <h3>Threats Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff7300" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#ff7300" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '5px' }} />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        <Line
                            type="monotone"
                            dataKey="threats"
                            stroke="url(#lineColor)"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#ff7300' }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart for Harmful IPs */}
            <div className="chart-container">
                <h3>Most Harmful IPs</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <defs>
                            {/* Example of adding a radial gradient for a nicer look */}
                            <radialGradient id="pieGradient" cx="0.5" cy="0.5" r="0.5">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#000000" stopOpacity={0.2} />
                            </radialGradient>
                        </defs>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}   // This makes it a donut chart
                            outerRadius={100}
                            fill="url(#pieGradient)"
                            labelLine={false}
                            label={pieData.length > 1 ? renderCustomizedLabel : null}
                            stroke="#222"      // Slight stroke for contrast
                            strokeWidth={2}
                            blendStroke
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{ filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))' }} // Add a subtle shadow
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend formatter={renderLegendText} wrapperStyle={{ color: '#fff' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Logs of Threats */}
            <div className="logs-container">
                <h3>Real-Time Threat Logs</h3>
                <div className="logs-box">
                    {filteredData.length === 0 ? (
                        <p>No logs match the current filter criteria.</p>
                    ) : (
                        filteredData.map((item, index) => (
                            <p key={index} className={item.critical ? 'log-entry critical' : 'log-entry'}>
                                [{item.time}] Threat detected with {item.threats} occurrences from IP {item.ip}.
                                {item.critical && <strong> (Critical)</strong>}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ThreatDetection;

