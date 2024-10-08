import React, { useState, useEffect } from 'react';
import './CyberGuardian.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issues in React-Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function CyberGuardian() {
  const [scanning, setScanning] = useState(false);
  const [threatsDetected, setThreatsDetected] = useState(0);
  const [scanResults, setScanResults] = useState(JSON.parse(localStorage.getItem('scanResults')) || {});
  const [ipAddress, setIpAddress] = useState(localStorage.getItem('ipAddress') || '');
  const [collapseResults, setCollapseResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  // New state variables for IP info
  const [ipInfo, setIpInfo] = useState(null);
  const [threatInfo, setThreatInfo] = useState(null);

  // New state variables for client's IP addresses
  const [ipv4Address, setIpv4Address] = useState('');
  const [ipv6Address, setIpv6Address] = useState('');

  // Function to fetch client's IP addresses
  const fetchClientIpAddresses = async () => {
    try {
      const apiKey = process.env.REACT_APP_IPIFY_API_KEY;

      // Fetch IPv4 address
      const ipv4Response = await axios.get(`https://api.ipify.org?format=json&apiKey=${apiKey}`);
      setIpv4Address(ipv4Response.data.ip);

      // Fetch IPv6 address
      const ipv6Response = await axios.get(`https://api64.ipify.org?format=json&apiKey=${apiKey}`);
      setIpv6Address(ipv6Response.data.ip);
    } catch (error) {
      console.error('Error fetching client IP addresses:', error);
    }
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

  // Function to fetch IP information
  const fetchIpInfo = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ip-info`, {
        ipv4: ipv4Address,
        ipv6: ipv6Address,
      });
      const data = response.data;

      setIpInfo(data.ipInfo);
      setThreatInfo(data.threatInfo);
    } catch (error) {
      console.error('Error fetching IP information:', error);
    }
  };

  // Function to initiate the network scan
  const initiateScan = async () => {
    setScanning(true);
    try {
      // First, fetch the client's IP addresses
      await fetchClientIpAddresses();

      // Now, fetch the IP info
      await fetchIpInfo();

      // Now, send the user's IP addresses to the backend for the scan
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/network-scan`, {
        ipv4: ipv4Address,
        ipv6: ipv6Address,
      });
      const data = response.data;

      // Use the IP address from the response or from the client
      const extractedIpAddress = data.ipAddress || ipv4Address || ipv6Address || '';

      setScanResults(data);  // Store the scan results
      setThreatsDetected(data.threat_count || 0);  // Update detected threats count
      setIpAddress(extractedIpAddress);  // Extract and store the IP address

      // Store the scan results and IP address in local storage
      localStorage.setItem('scanResults', JSON.stringify(data));
      localStorage.setItem('ipAddress', extractedIpAddress);

      // Expand the scan results to show them
      setCollapseResults(true);
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setScanning(false);
    }
  };

  // Function to render scan results table
  const renderScanResultsTable = (scanData) => {
    if (!scanData || !scanData.result) return null;

    const resultDescriptions = {
      ipAddress: "IP Address",
      vpn: "VPN Detected",
      datacenter: "Data Center Origin",
      // ... (other keys)
    };

    // Tooltip content for each key
    const resultTooltipInfo = {
      ipAddress: "Information about IP Address.",
      vpn: "Indicates if the detected IP is from a VPN service.",
      datacenter: "Shows if the IP belongs to a known data center.",
      // ... (other keys)
    };

    return (
      <div className="scan-results-card">
        <h2>Scan Results:</h2>
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

        {/* Display IP Information */}
        {ipInfo && (
          <div className="ip-info">
            <h2>Your IP Addresses:</h2>
            {ipv4Address && <p><strong>IPv4:</strong> {ipv4Address}</p>}
            {ipv6Address && <p><strong>IPv6:</strong> {ipv6Address}</p>}
            <p><strong>City:</strong> {ipInfo.city || 'N/A'}</p>
            <p><strong>Region:</strong> {ipInfo.region || 'N/A'}</p>
            <p><strong>Country:</strong> {ipInfo.country || 'N/A'}</p>

            {ipInfo.latitude && ipInfo.longitude && (
              <div className="map-card">
                <MapContainer
                  center={[ipInfo.latitude, ipInfo.longitude]}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[ipInfo.latitude, ipInfo.longitude]}>
                    <Popup>
                      {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {/* Display Threat Analysis */}
        {threatInfo && (
          <div className="threat-analysis">
            <h2>Threat Analysis</h2>
            <p><strong>Fraud Score:</strong> {threatInfo.fraud_score}</p>
            <p><strong>Is Proxy:</strong> {threatInfo.proxy ? 'Yes' : 'No'}</p>
            <p><strong>Is VPN:</strong> {threatInfo.vpn ? 'Yes' : 'No'}</p>
            <p><strong>Is Tor:</strong> {threatInfo.tor ? 'Yes' : 'No'}</p>
            <p><strong>Recent Abuse:</strong> {threatInfo.recent_abuse ? 'Yes' : 'No'}</p>
            <p><strong>Bot Status:</strong> {threatInfo.bot_status ? 'Yes' : 'No'}</p>
          </div>
        )}

        <button className="collapse-button" onClick={() => setCollapseResults(false)}>
          Hide Scan Results
        </button>
      </div>
    );
  };

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
            ✅ No threats detected. Your IP Address: {ipAddress}
          </p>
        )}

        {/* Collapsible Scan Results */}
        {scanResults && (
          <div className="scan-results">
            {collapseResults ? (
              <>
                {renderScanResultsTable(scanResults)}
              </>
            ) : (
              <button 
                className="collapse-button" 
                onClick={() => setCollapseResults(true)}
              >
                Show Scan Results
              </button>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default CyberGuardian;
