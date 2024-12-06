import React, { useState } from 'react'; 
import './ClearingCacheTool.css';

function ClearingCacheTool() {
    const [timeRange, setTimeRange] = useState('1h'); // default to last 1 hour
    const [isClearing, setIsClearing] = useState(false);
    const [isCleared, setIsCleared] = useState(false);

    const handleClearData = () => {
        setIsClearing(true);
        setIsCleared(false);
        
        // Simulate an async clearing operation
        setTimeout(() => {
            setIsClearing(false);
            setIsCleared(true);
        }, 2000);
    };

    return (
        <div className="clearing-cache-tool">
            <h2>Adware Cache Clearer</h2>

            {/* Development Notice */}
            <div className="development-notice">
                <p><strong>Note:</strong> This feature is currently in development. Some functionalities, such as data clearing, may not be fully operational yet. We appreciate your understanding and patience as we continue to improve this part of the project.</p>
            </div>

            <p>
                The <strong>Adware Cache Clearer</strong> extension helps you protect your privacy and security by automatically
                clearing cached data, cookies, and browsing history that may be associated with unwanted tracking or adware scams, 
                such as the <em>Microsoft Trojan Horse Scam</em>.
            </p>
            <p>
                Select the time range for clearing your browser data:
            </p>
            <div className="time-range-options">
                <label>
                    <input 
                        type="radio" 
                        name="timeRange" 
                        value="1h" 
                        checked={timeRange === '1h'} 
                        onChange={(e) => setTimeRange(e.target.value)} 
                    />
                    Last 1 Hour
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="timeRange" 
                        value="24h" 
                        checked={timeRange === '24h'} 
                        onChange={(e) => setTimeRange(e.target.value)} 
                    />
                    Last 24 Hours
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="timeRange" 
                        value="all" 
                        checked={timeRange === 'all'} 
                        onChange={(e) => setTimeRange(e.target.value)} 
                    />
                    All Time
                </label>
            </div>

            <p>
                By clearing this data, the extension <strong>signs you out of websites</strong> to prevent any compromised sessions 
                from persisting.
            </p>

            <button className="clear-button" onClick={handleClearData} disabled={isClearing}>
                {isClearing ? 'Clearing...' : 'Clear Now'}
            </button>

            {/* Show loading spinner when clearing */}
            {isClearing && (
                <div className="status-message">
                    <div className="spinner"></div>
                    <p>Clearing your {timeRange === '1h' ? 'last hour' : timeRange === '24h' ? '24 hours' : 'all-time'} data...</p>
                </div>
            )}

            {/* Show success message once cleared */}
            {isCleared && !isClearing && (
                <div className="status-message success">
                    <p><strong>All data cleared successfully!</strong></p>
                    <p>You have been signed out of all websites for enhanced security.</p>
                </div>
            )}
        </div>
    );
}

export default ClearingCacheTool;
