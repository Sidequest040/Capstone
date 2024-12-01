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

    const [responseMessage, setResponseMessage] = useState(() => sessionStorage.getItem('responseMessage') || '');
    const [loading, setLoading] = useState(false); // New state to track loading

    useEffect(() => {
        sessionStorage.setItem('logData', logData);
        sessionStorage.setItem('responseMessage', responseMessage);

        const handleBeforeUnload = () => {
            sessionStorage.removeItem('responseMessage');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [logData, responseMessage]);

    const handleSendDataClick = async () => {
        setLoading(true); // Show loader
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/test-connection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ logData }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const result = await response.json();
      
          if (typeof result.message !== 'string') {
            throw new Error('Backend response message is not a string');
          }
      
          setResponseMessage(result.message);
      
          const parsedData = JSON.parse(logData);
          const formattedData = [];
      
          parsedData.forEach((log) => {
            const timeMatch = log.match(/\[(.*?)\]/);
            const ipMatch = log.match(/IP\s(\d+\.\d+\.\d+\.\d+)/);
            const ip = ipMatch ? ipMatch[1] : 'Unknown';
            const critical = log.toLowerCase().includes('unauthorized') || log.toLowerCase().includes('malware');
            const existingEntry = formattedData.find((entry) => entry.time === timeMatch[1] && entry.ip === ip);
      
            if (existingEntry) {
              existingEntry.threats += 1;
            } else {
              formattedData.push({
                time: timeMatch ? timeMatch[1] : 'Unknown',
                threats: 1,
                ip: ip,
                critical: critical,
                date: new Date().toISOString().slice(0, 10),
              });
            }
          });
      
          setThreatData(formattedData);
        } catch (error) {
          console.error('Error testing connection:', error);
          setResponseMessage('There was an error connecting to the backend.');
        } finally {
          setLoading(false); // Hide loader
        }
      };
      

    // Function to format response message
    const formatResponseMessage = (message) => {
        if (typeof message !== 'string') {
          console.warn('Response message is not a string:', message);
          return 'Unexpected response format.';
        }
      
        // Remove all instances of `--•` completely
        let formattedMessage = message.replace(/--•\s*/g, ''); // Removes `--•` and any trailing whitespace
      
        // Remove table-like lines (dotted lines or similar table dividers)
        formattedMessage = formattedMessage.replace(/^\|[-\s|]+\|$/gm, '');
      
        // Remove any orphaned `###` if still present (just in case)
        formattedMessage = formattedMessage.replace(/###/g, '');
      
        // Italicize section titles (e.g., "Conclusion:" or anything ending with ":")
        formattedMessage = formattedMessage.replace(/(\b[A-Z][a-zA-Z\s]*:)/g, '<em>$1</em>');
      
        // Bold for `**text**`
        formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
        // Replace `- ` with bullet points
        formattedMessage = formattedMessage.replace(/-\s/g, '• ');
      
        return formattedMessage;
      };
      
      
    return (
        <div className="threat-detection-page">
            <h2>Threat Detection</h2>
            <textarea 
                value={logData} 
                onChange={(e) => setLogData(e.target.value)} 
                placeholder="Enter mock log data here..." 
                rows="10" 
                cols="50"
            />
            <button onClick={handleSendDataClick} disabled={loading}>
                {loading ? <div className="loader"></div> : "Analyze Logs"}
            </button>
            {responseMessage && (
                <div className="response-message">
                    <h3>Analysis Result:</h3>
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
