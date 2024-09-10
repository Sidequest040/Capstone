import React, { useState } from 'react';
import './CyberGuardian.css';

function CyberGuardian() {
    const [showAlert, setShowAlert] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [threatsDetected, setThreatsDetected] = useState(0);

    const toggleAlert = () => {
        setShowAlert(!showAlert);
    };

    const initiateScan = () => {
        setScanning(true);
        // Simulating a network scan with a timeout
        setTimeout(() => {
            const detectedThreats = Math.floor(Math.random() * 5); // Simulates 0 to 4 threats found
            setThreatsDetected(detectedThreats);
            setScanning(false);
        }, 3000);
    };

    return (
        <div className="CyberGuardian">
            <header className="CyberGuardian-header">
                <h1>CyberGuardian Dashboard</h1>
                <p>Protecting your network and monitoring threats in real-time.</p>
                
                <button className="network-scan-button" onClick={initiateScan}>
                    {scanning ? 'Scanning...' : 'Initiate Network Scan'}
                </button>

                {scanning && <p className="scan-status">Performing network scan, please wait...</p>}

                {threatsDetected > 0 && !scanning && (
                    <div className="threat-status">
                        <p>⚠️ {threatsDetected} threats detected in your network!</p>
                    </div>
                )}

                {threatsDetected === 0 && !scanning && (
                    <p className="no-threats">✅ No threats detected. Your network is secure.</p>
                )}

                <button className="cool-alert-button" onClick={toggleAlert}>
                    {showAlert ? 'Hide Security Alert' : 'Show Security Alert'}
                </button>

                {showAlert && (
                    <div className="security-alert">
                        <p>⚠️ Immediate action required: A critical threat has been detected!</p>
                    </div>
                )}
            </header>
        </div>
    );
}

export default CyberGuardian;
