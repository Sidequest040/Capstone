import React, { useState } from 'react';

function ThreatDetectionPage() {
    // Reduced mock log data to avoid exceeding token limits
    const [logData, setLogData] = useState(`[
        "[00:00] User login attempt from IP 192.168.1.1",
        "[00:10] Potential phishing email detected from IP 192.168.1.2",
        "[00:20] Malware detected in file upload from IP 192.168.1.3",
        "[00:30] Unauthorized access attempt blocked from IP 192.168.1.4",
        "[00:40] User login attempt failed from IP 192.168.1.5"
    ]`);
    const [responseMessage, setResponseMessage] = useState('');

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
        } catch (error) {
            console.error('Error testing connection:', error);
            setResponseMessage('There was an error connecting to the backend.');
        }
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
                        dangerouslySetInnerHTML={{ __html: responseMessage.replace(/\n/g, '<br/>') }}
                    />
                </div>
            )}
        </div>
    );
}

export default ThreatDetectionPage;
