import React, { useState, useContext, useEffect } from 'react';
import './ThreatDetectionPage.css';
import { ThreatContext } from './ThreatContext';
import Toast from './Toast';

function ThreatDetectionPage() {
  const { setThreatData } = useContext(ThreatContext);

  const defaultLogs = [
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
  ].join('\n');

  const [logData, setLogData] = useState(() => sessionStorage.getItem('logData') || defaultLogs);
  const [responseMessage, setResponseMessage] = useState(() => sessionStorage.getItem('responseMessage') || '');
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    // Input validation
    if (!logData.trim()) {
      setErrorMsg("Log data is empty. Please provide logs before analyzing.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Parse and structure the log data
      const newData = parseLogs(logData);
      setThreatData(newData);
      setFormattedData(newData);
    } catch (error) {
      console.error('Error testing connection:', error);
      setResponseMessage('');
      setErrorMsg('There was an error connecting to the backend. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const parseLogs = (logs) => {
    const parsedData = logs.split('\n').filter(line => line.trim() !== '');
    const newData = [];

    parsedData.forEach((log) => {
      const timeMatch = log.match(/\[(.*?)\]/);
      const ipMatch = log.match(/IP\s(\d+\.\d+\.\d+\.\d+)/);
      const ip = ipMatch ? ipMatch[1] : 'Unknown';
      const critical = log.toLowerCase().includes('unauthorized') || log.toLowerCase().includes('malware');
      const time = timeMatch ? timeMatch[1] : 'Unknown';

      // Check if there's an existing entry for the same time & IP
      const existingEntry = newData.find((entry) => entry.time === time && entry.ip === ip);

      if (existingEntry) {
        existingEntry.threats += 1;
        existingEntry.critical = existingEntry.critical || critical; 
      } else {
        newData.push({
          time: time,
          threats: 1,
          ip: ip,
          critical: critical,
          date: new Date().toISOString().slice(0, 10),
        });
      }
    });

    return newData;
  };

  const formatResponseMessage = (message) => {
    if (typeof message !== 'string') {
      console.warn('Response message is not a string:', message);
      return 'Unexpected response format.';
    }

    let formattedMessage = message.replace(/--\s*•\s*/g, '');
    formattedMessage = formattedMessage.replace(/^\|[-\s|]+\|$/gm, '');
    formattedMessage = formattedMessage.replace(/###/g, '');
    formattedMessage = formattedMessage.replace(/(\b[A-Z][a-zA-Z\s]*:)/g, '<em>$1</em>');
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedMessage = formattedMessage.replace(/-\s/g, '• ');

    return formattedMessage;
  };

  const copyToClipboard = () => {
    const textToCopy = responseMessage;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setToastMessage('Analysis copied to clipboard!');
      setIsToastVisible(true);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formattedData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "threat_analysis.json");
    dlAnchorElem.click();
  };

  const totalThreats = formattedData.reduce((sum, entry) => sum + entry.threats, 0);
  const criticalCount = formattedData.filter(entry => entry.critical).length;
  const uniqueIPs = new Set(formattedData.map(entry => entry.ip)).size;

  const handleCloseToast = () => {
    setIsToastVisible(false);
  };

  const resetData = () => {
    setLogData(defaultLogs);
    setResponseMessage('');
    setFormattedData([]);
    setShowOnlyCritical(false);
    setErrorMsg('');
  };

  const filteredData = showOnlyCritical ? formattedData.filter(entry => entry.critical) : formattedData;

  return (
    <div className="threat-detection-page">
      <h2>Log Analyzer</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      <textarea
        value={logData}
        onChange={(e) => setLogData(e.target.value)}
        placeholder="Enter mock log data here..."
        rows="10"
        cols="50"
      />
      <div className="actions">
        <button onClick={handleSendDataClick} disabled={loading}>
          {loading ? <div className="loader"></div> : "Analyze Logs"}
        </button>
        <button onClick={resetData}>Reset Data</button>
      </div>

      {responseMessage && (
        <div className="response-message">
          <h3>Analysis Result:</h3>
          <div
            className="formatted-response"
            dangerouslySetInnerHTML={{ __html: formatResponseMessage(responseMessage).replace(/\n/g, '<br/>') }}
          />

          {formattedData.length > 0 && (
            <div className="analysis-summary">
              <h4>Summary</h4>
              <p><strong>Total Threats:</strong> {totalThreats}</p>
              <p><strong>Critical Threats:</strong> {criticalCount}</p>
              <p><strong>Unique IPs:</strong> {uniqueIPs}</p>
              <div className="summary-actions">
                <button onClick={copyToClipboard}>Copy Analysis</button>
                <button onClick={downloadJSON}>Download JSON</button>
              </div>

              <div className="filters">
                <label>
                  <input
                    type="checkbox"
                    checked={showOnlyCritical}
                    onChange={(e) => setShowOnlyCritical(e.target.checked)}
                  />
                  Show Only Critical Threats
                </label>
              </div>

              {filteredData.length > 0 ? (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>IP Address</th>
                      <th>Threats</th>
                      <th>Critical?</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.time}</td>
                        <td>{entry.ip}</td>
                        <td>{entry.threats}</td>
                        <td>{entry.critical ? 'Yes' : 'No'}</td>
                        <td>{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No threats found under the current filter.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default ThreatDetectionPage;
