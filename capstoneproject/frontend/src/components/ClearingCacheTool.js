/* global chrome */
import React, { useState } from 'react';
import './ClearingCacheTool.css';  // Import the specific CSS file

function ClearingCacheTool() {
    const [timeRange, setTimeRange] = useState('1hour');
    const [signOut, setSignOut] = useState(false);

    const handleClearCache = () => {
        // Determine the time range in milliseconds
        let sinceTime = (new Date()).getTime();  // Current time
        if (timeRange === '1hour') {
            sinceTime = sinceTime - (60 * 60 * 1000);  // Last 1 hour
        } else if (timeRange === '1day') {
            sinceTime = sinceTime - (24 * 60 * 60 * 1000);  // Last 24 hours
        } else if (timeRange === 'alltime') {
            sinceTime = 0;  // All time
        }

        // Log the message to be sent to the extension
        console.log("Attempting to send message to extension:", {
            type: 'CLEAR_CACHE',
            since: sinceTime,
            signOut: signOut,
        });

        // Send a message to the Chrome extension to clear the cache
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                type: 'CLEAR_CACHE',
                since: sinceTime,
                signOut: signOut,
            }, (response) => {
                if (response && response.success) {
                    alert('Cache, cookies, and history have been successfully cleared!');
                } else {
                    alert('Something went wrong. Please make sure the extension is running and try again.');
                }
            });
        } else {
            alert('This feature works only in Chrome with the extension installed.');
        }
    };

    return (
        <div className="clearing-cache-tool">
            <h2>Clearing Cache Tool</h2>
            <p>This tool helps clear cache data to improve performance and protect from adware scams.</p>

            <div className="time-range">
                <label htmlFor="timeRange">Select time range to clear cache:</label>
                <select
                    id="timeRange"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="1hour">Last 1 Hour</option>
                    <option value="1day">Last 24 Hours</option>
                    <option value="alltime">All Time</option>
                </select>
            </div>

            <div className="sign-out-option">
                <label htmlFor="signOut">Sign out of websites:</label>
                <input
                    type="checkbox"
                    id="signOut"
                    checked={signOut}
                    onChange={() => setSignOut(!signOut)}
                />
            </div>

            <button onClick={handleClearCache} className="clear-button">
                Clear Cache and History
            </button>
        </div>
    );
}

export default ClearingCacheTool;
