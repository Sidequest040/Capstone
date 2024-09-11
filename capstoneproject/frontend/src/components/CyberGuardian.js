import React, { useState } from 'react';
import './CyberGuardian.css';
import axios from 'axios';  // Import axios for making API requests

function CyberGuardian() {
    const [scanning, setScanning] = useState(false);
    const [threatsDetected, setThreatsDetected] = useState(0);
    const [scanResults, setScanResults] = useState(null);  // Store the scan results
    const [ipAddress, setIpAddress] = useState('');  // Store the IP address

    // Function to initiate the network scan
    const initiateScan = async () => {
        setScanning(true);
        try {
            // Make a request to the backend API to start the scan
            const response = await axios.get('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/network-scan');
            setScanResults(response.data);  // Store the scan results
            setThreatsDetected(response.data.threat_count || 0);  // Update detected threats count
            setIpAddress(response.data.result.ipAddress || '');  // Extract and store the IP address
        } catch (error) {
            console.error('Error during scan:', error);
        } finally {
            setScanning(false);
        }
    };

    // Helper function to map scan result keys to user-friendly descriptions
    const renderScanResultsTable = (scanData) => {
        if (!scanData || !scanData.result) return null;

        const resultDescriptions = {
            ipAddress: "IP Address",
            isVpn: "VPN Detected",
            isDataCenter: "Data Center Origin",
            isBruteForce: "Brute Force Attack",
            isSpam: "Spam Detected",
            isProxy: "Proxy Detected",
            isMalware: "Malware Detected",
            isCompromised: "Compromised System",
            isBot: "Bot Activity",
            isDynamic: "Dynamic IP",
            // Add more descriptions as needed
        };

        return (
            <table className="scan-results-table">
                <thead>
                    <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(resultDescriptions).map((key) => (
                        <tr key={key}>
                            <td>{resultDescriptions[key]}</td>
                            <td>{scanData.result[key] ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="CyberGuardian">
            <header className="CyberGuardian-header">
                <h1>CyberGuardian Dashboard</h1>
                <p>Protecting your network and monitoring threats in real-time.</p>

                {/* Initiate Network Scan Button */}
                <button className="network-scan-button" onClick={initiateScan}>
                    {scanning ? 'Scanning...' : 'Initiate Network Scan'}
                </button>

                {scanning && <p className="scan-status">Performing network scan, please wait...</p>}

                {/* Display Threats Detected */}
                {threatsDetected > 0 && !scanning && (
                    <div className="threat-status">
                        <p>⚠️ {threatsDetected} threats detected in your network!</p>
                    </div>
                )}

                {threatsDetected === 0 && !scanning && (
                    <p className="no-threats">
                        ✅ No threats detected. Your network is secure. Your IP Address: {ipAddress}
                    </p>
                )}

                {/* Display Scan Results in a Table */}
                {scanResults && (
                    <div className="scan-results">
                        <h2>Scan Results:</h2>
                        {renderScanResultsTable(scanResults)}
                    </div>
                )}

            </header>
        </div>
    );
}

export default CyberGuardian;
