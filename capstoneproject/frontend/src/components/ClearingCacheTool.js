import React from 'react';
import './ClearingCacheTool.css';  // Import the specific CSS file

function ClearingCacheTool() {
    return (
        <div className="clearing-cache-tool">
            <h2>Adware Cache Clearer</h2>
            <p>
                The <strong>Adware Cache Clearer</strong> extension helps you protect your privacy and security by automatically
                clearing cached data, cookies, and browsing history that may be associated with unwanted tracking or adware scams, 
                such as the <em>Microsoft Trojan Horse Scam</em>.
            </p>
            <p>
                With this tool, you can select the time range for which you want to clear your browser data. Options include:
            </p>
            <ul>
                <li><strong>Last 1 Hour</strong> – Quickly remove recent cache and cookies.</li>
                <li><strong>Last 24 Hours</strong> – Clear browsing data from the last day.</li>
                <li><strong>All Time</strong> – Remove all cached data, cookies, and browsing history.</li>
            </ul>
            <p>
                In addition to clearing cache and cookies, the extension <strong>automatically signs you out of websites </strong> 
                when the data is cleared. This ensures that you’re fully logged out of potentially compromised sessions that 
                could be affected by adware or phishing scams.
            </p>
            <p>
                This extension is particularly useful if you’ve encountered suspicious ads, fake scam warnings, or phishing attempts. 
                It helps prevent further tracking by clearing all relevant data and ensuring your browser is secure.
            </p>
        </div>
    );
}

export default ClearingCacheTool;
