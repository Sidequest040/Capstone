import React, { useState, useEffect } from 'react';
import './CyberGuardian.css';
import axios from 'axios';

function CyberGuardian() {
    const [scanning, setScanning] = useState(false);
    const [threatsDetected, setThreatsDetected] = useState(0);
    const [scanResults, setScanResults] = useState(JSON.parse(localStorage.getItem('scanResults'))); // Load from local storage if available
    const [ipAddress, setIpAddress] = useState(localStorage.getItem('ipAddress') || '');  // Load from local storage if available
    const [collapseResults, setCollapseResults] = useState(false);
    const [showTooltip, setShowTooltip] = useState(null);  // Track which tooltip is visible

    // Function to initiate the network scan
    const initiateScan = async () => {
        setScanning(true);
        try {
            // Make a request to the backend API to start the scan
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/network-scan`);
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
    
        // Tooltip content for each key
        const resultTooltipInfo = {
            ipAddress: "Information about IP Address.",
            isVpn: "Indicates if the detected IP is from a VPN service.",
            isDataCenter: "Shows if the IP belongs to a known data center.",
            isBruteForce: "Detection of potential brute force attacks.",
            isSpam: "Whether the IP is associated with spamming activity.",
            isProxy: "Indicates if a proxy is being used.",
            isMalware: "Shows if malware was detected in network activity.",
            isCompromised: "Indicates if the system has been compromised.",
            isBot: "Detection of bot activity.",
            isDynamic: "Shows if the IP address is dynamically assigned.",
        };
    
        return (
            <div className="scan-results-card">
                <ul className="card__list">
                    {Object.keys(resultDescriptions).map((key) => (
                        <li key={key} className="card__list_item">
                            <span className="list_text">
                                {resultDescriptions[key]}
                                <span 
                                    className="tooltip" 
                                    onClick={() => setShowTooltip(showTooltip === key ? null : key)}
                                >
                                    ℹ️
                                </span>
                            </span>
                            <span className={scanData.result[key] ? 'value-yes' : 'value-no'}>
                                {scanData.result[key] ? "✔" : "❌"}
                            </span>
    
                            {/* Conditionally render tooltip content */} 
                            {showTooltip === key && (
                                <div className="tooltip-box">
                                    {resultTooltipInfo[key]}
                                </div>
                            )}
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
