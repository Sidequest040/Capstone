import React, { useState, useEffect } from 'react';
import './CyberGuardian.css';
import axios from 'axios';

function CyberGuardian() {
    const [scanning, setScanning] = useState(false);
    const [threatsDetected, setThreatsDetected] = useState(0);
    const [scanResults, setScanResults] = useState(JSON.parse(localStorage.getItem('scanResults'))); // Load from local storage if available
    const [ipAddress, setIpAddress] = useState(localStorage.getItem('ipAddress') || '');  // Load from local storage if available
    const [collapseResults, setCollapseResults] = useState(false);

    // Function to initiate the network scan
    const initiateScan = async () => {
        setScanning(true);
        try {
            // Make a request to the backend API to start the scan
            const response = await axios.get('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/network-scan');
            const data = response.data;

            setScanResults(data);  // Store the scan results
            setThreatsDetected(data.threat_count || 0);  // Update detected threats count
            setIpAddress(data.result.ipAddress || '');  // Extract and store the IP address

            // Store the scan results and IP address in local storage
            localStorage.setItem('scanResults', JSON.stringify(data));
            localStorage.setItem('ipAddress', data.result.ipAddress || '');
        } catch (error) {
            console.error('Error during scan:', error);
        } finally {
            setScanning(false);
        }
    };

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
        };
    
        return (
            <div className="scan-results-card">
                <h2>Scan Results</h2>
                <ul className="card__list">
                    {Object.keys(resultDescriptions).map((key) => (
                        <li key={key} className="card__list_item">
                            <span className="list_text">
                                {resultDescriptions[key]}
                                <span className="tooltip" data-tooltip={`Info about ${resultDescriptions[key]}`}>ℹ️</span>
                            </span>
                            <span className={scanData.result[key] ? 'value-yes' : 'value-no'}>
                                {scanData.result[key] ? "✔" : "❌"}
                            </span>
                        </li>
                    ))}
                </ul>
                <button className="collapse-button" onClick={() => setCollapseResults(false)}>
                    Hide Scan Results
                </button>
            </div>
        );
    };
    

    // Clear local storage on refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem('scanResults');
            localStorage.removeItem('ipAddress');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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

                {/* Collapsible Scan Results */}
                <button 
                    className="collapse-button" 
                    onClick={() => setCollapseResults(!collapseResults)}
                >
                    {collapseResults ? "Hide Scan Results" : "Show Scan Results"}
                </button>

                {collapseResults && scanResults && (
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
