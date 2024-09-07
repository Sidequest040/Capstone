import React, { useState, useContext, useEffect } from 'react';
import './ThreatDetectionPage.css';  // Import the new CSS file
import { ThreatContext } from './ThreatContext';

function ThreatDetectionPage() {
    const { setThreatData } = useContext(ThreatContext);

    // Store logData in sessionStorage, and use it to restore state if available
    const [logData, setLogData] = useState(() => {
        return sessionStorage.getItem('logData') || `[
            "[00:00] User login attempt from IP 192.168.1.1",
            "[00:00] User login attempt from IP 192.168.1.1",
            "[00:00] User login attempt from IP 192.168.1.1",
            "[00:10] Potential phishing email detected from IP 192.168.1.1",
            "[00:20] Malware detected in file upload from IP 192.168.1.3",
            "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4", 
            "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4",
            "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4",
            "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4",
            "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4",
            "[00:40] User login attempt failed from IP 192.168.1.1",
            "[00:40] User login attempt failed from IP 192.168.1.1",
            "[00:40] User login attempt failed from IP 192.168.1.1",
            "[00:40] User login attempt failed from IP 192.168.1.1",
            "[00:50] User login attempt succeeded from IP 192.168.1.1"
        ]`;
    });

    // AI response, cleared on refresh, persists across page navigation
    const [responseMessage, setResponseMessage] = useState(() => sessionStorage.getItem('responseMessage') || '');

    useEffect(() => {
        // Store logData in sessionStorage on change
        sessionStorage.setItem('logData', logData);

        // Store the AI response only for navigation (clear it on refresh)
        sessionStorage.setItem('responseMessage', responseMessage);

        // Clear sessionStorage when the page is refreshed
        const handleBeforeUnload = () => {
            sessionStorage.removeItem('responseMessage');  // Clear AI response
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [logData, responseMessage]);

    const handleSendDataClick = async () => {
        try {
            const response = await fetch('https://curly-space-umbrella-wrvpgg974x9j25x4r-3001.app.github.dev/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logData }),
            });

            const result = await response.json();
            setResponseMessage(result.message);

            // Process the logData into a format suitable for the graph
            const parsedData = JSON.parse(logData);
            const formattedData = [];

            parsedData.forEach(log => {
                const timeMatch = log.match(/\[(.*?)\]/);
                const ipMatch = log.match(/IP\s(\d+\.\d+\.\d+\.\d+)/);
                const ip = ipMatch ? ipMatch[1] : 'Unknown';
                const critical = log.includes('unauthorized') || log.includes('malware'); // Detect critical threats
                const existingEntry = formattedData.find(entry => entry.time === timeMatch[1] && entry.ip === ip);

                if (existingEntry) {
                    existingEntry.threats += 1;
                } else {
                    formattedData.push({
                        time: timeMatch ? timeMatch[1] : 'Unknown',
                        threats: 1,
                        ip: ip,
                        critical: critical, // Store the critical status
                        date: new Date().toISOString().slice(0, 10),
                    });
                }
            });

            setThreatData(formattedData);
        } catch (error) {
            console.error('Error testing connection:', error);
            setResponseMessage('There was an error connecting to the backend.');
        }
    };

    const formatResponseMessage = (message) => {
        let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedMessage = formattedMessage.replace(/-\s/g, '• ');
        return formattedMessage;
    };

    return (
        <div className="threat-detection-page">
            <h2>Test Backend Connection</h2>
            <textarea 
                value={logData} 
                onChange={(e) => setLogData(e.target.value)} 
                placeholder="Enter mock log data here..." 
                rows="10" 
                cols="50"
            />
            <button onClick={handleSendDataClick}>Send Data to Backend</button>
            {responseMessage && (
                <div className="response-message">
                    <h3>Response from Backend:</h3>
                    <div 
                        className="formatted-response"
                        dangerouslySetInnerHTML={{ __html: formatResponseMessage(responseMessage).replace(/\n/g, '<br/>') }}
                    />
                </div>
            )}
        </div>
    );
}

export default ThreatDetectionPage;
