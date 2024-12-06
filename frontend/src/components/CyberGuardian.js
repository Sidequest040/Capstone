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
  // **Removed ipAddress state**
  // const [ipAddress, setIpAddress] = useState(localStorage.getItem('ipAddress') || '');
  const [collapseResults, setCollapseResults] = useState(false);
  const [hasScanned, setHasScanned] = useState(false); // **New state variable**

  // State variables for IP info
  const [ipInfo, setIpInfo] = useState(JSON.parse(localStorage.getItem('ipInfo')) || null);
  const [threatInfo, setThreatInfo] = useState(JSON.parse(localStorage.getItem('threatInfo')) || null);

  // State variables for client's IP addresses
  const [ipv4Address, setIpv4Address] = useState('');
  const [ipv6Address, setIpv6Address] = useState('');

  // Function to fetch client's IP addresses and return them
  const fetchClientIpAddresses = async () => {
    try {
      // Fetch IPv4 address
      const ipv4Response = await axios.get('https://api.ipify.org?format=json');
      const ipv4 = ipv4Response.data.ip;

      let ipv6 = 'Not Available'; // **Default value if IPv6 isn't available**

      try {
        // Fetch IPv6 address
        const ipv6Response = await axios.get('https://api64.ipify.org?format=json');
        const fetchedIpv6 = ipv6Response.data.ip;

        // Check if IPv6 address is different from IPv4 address
        if (fetchedIpv6 && fetchedIpv6 !== ipv4) {
          ipv6 = fetchedIpv6;
        }
      } catch (ipv6Error) {
        console.error('Error fetching IPv6 address:', ipv6Error);
        // ipv6 remains 'Not Available'
      }

      // Update state
      setIpv4Address(ipv4);
      setIpv6Address(ipv6);

      return { ipv4, ipv6 };
    } catch (error) {
      console.error('Error fetching client IP addresses:', error);
      throw error; // Rethrow to be caught in initiateScan
    }
  };

  // Clear local storage on refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('scanResults');
      // **Removed ipAddress removal**
      // localStorage.removeItem('ipAddress');
      localStorage.removeItem('ipInfo');
      localStorage.removeItem('threatInfo');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Function to fetch IP information, accepting IP addresses as parameters
  const fetchIpInfo = async (ipv4, ipv6) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ip-info`, {
        ipv4,
        ipv6,
      });
      const data = response.data;

      // Set state variables
      setIpInfo(data.ipInfo);
      setThreatInfo(data.threatInfo);

      // Store in local storage
      localStorage.setItem('ipInfo', JSON.stringify(data.ipInfo));
      localStorage.setItem('threatInfo', JSON.stringify(data.threatInfo));

      return data; // Return data for immediate use
    } catch (error) {
      console.error('Error fetching IP information:', error);
      throw error; // Rethrow the error to be caught in initiateScan
    }
  };

  // Function to initiate the network scan
  const initiateScan = async () => {
    setScanning(true);
    try {
      // Fetch the client's IP addresses and get them directly
      const { ipv4, ipv6 } = await fetchClientIpAddresses();

      // Fetch the IP info using the fetched IPs
      const data = await fetchIpInfo(ipv4, ipv6);

      // **Removed ipAddress logic**
      // const extractedIpAddress = (data.ipInfo && data.ipInfo.ip) || ipv4 || ipv6 || '';
      // setIpAddress(extractedIpAddress);
      // localStorage.setItem('ipAddress', extractedIpAddress);

      // Determine threats detected based on data.threatInfo
      let detected = 0;
      if (data.threatInfo) {
        // Exclude 'ipAddress' from the count
        detected = Object.entries(data.threatInfo)
          .filter(([key, value]) => key !== 'ipAddress' && value === true)
          .length;
      }
      setThreatsDetected(detected);

      // Store scan results in local storage
      localStorage.setItem('scanResults', JSON.stringify({ ipInfo: data.ipInfo, threatInfo: data.threatInfo }));

      // Expand the scan results to show them
      setCollapseResults(true);

      // **Set hasScanned to true after successful scan**
      setHasScanned(true);
    } catch (error) {
      console.error('Error during scan:', error);
      alert('An error occurred during the scan. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  // Helper function to format threat names
  const formatThreatName = (name) => {
    // Remove 'is' prefix and convert camelCase to regular text
    return name
      .replace(/^is/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Function to render scan results
  const renderScanResults = () => {
    return (
      <div className="scan-results-card">
        <h2>Scan Results:</h2>

        {/* Display IP Information */}
        {ipInfo && (
          <div className="ip-info">
            <h3>Your IP Information:</h3>
            
            {/* Display IPv4 and IPv6 Addresses at the Top */}
            <p>
              <strong>IPv4 Address:</strong> {ipv4Address || 'Not Available'}
            </p>
            <p>
              <strong>IPv6 Address:</strong> {ipv6Address || 'Not Available'}
            </p>

            {/* Removed the General IP Address */}
            {/* <p>
              <strong>IP:</strong> {ipInfo.ip}
            </p> */}

            <p>
              <strong>Country:</strong> {ipInfo.country}
            </p>
            <p>
              <strong>Region:</strong> {ipInfo.regionName}
            </p>
            <p>
              <strong>City:</strong> {ipInfo.city}
            </p>
            <p>
              <strong>ISP:</strong> {ipInfo.isp}
            </p>
            <p>
              <strong>Timezone:</strong> {ipInfo.timeZone}
            </p>
          </div>
        )}

        {/* Display Map */}
        {ipInfo && ipInfo.latitude && ipInfo.longitude && (
          <div className="map-card">
            <MapContainer
              center={[ipInfo.latitude, ipInfo.longitude]}
              zoom={13}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[ipInfo.latitude, ipInfo.longitude]}>
                <Popup>
                  {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Display Threat Analysis */}
        {threatInfo && (
          <div className="threat-analysis">
            <h3>Threat Analysis:</h3>
            <ul className="threat-list">
              {Object.entries(threatInfo)
                .filter(([key]) => key !== 'ipAddress') // Exclude 'ipAddress'
                .map(([key, value]) => (
                  <li key={key}>
                    <span className="threat-name">{formatThreatName(key)}</span>
                    <span className={`threat-status ${value ? 'danger' : 'ok'}`}>
                      {value ? '❌' : '✔'}
                    </span>
                  </li>
                ))}
            </ul>
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
        <h1>Security Center</h1>
        <p>Protecting your network and monitoring threats in real-time.</p>

        {/* Initiate Network Scan Button */}
        <button className="network-scan-button" onClick={initiateScan} disabled={scanning}>
          {scanning ? 'Scanning...' : 'Initiate Network Scan'}
        </button>

        {scanning && <p className="scan-status">Performing network scan, please wait...</p>}

        {/* Display Threats Detected */}
        {threatsDetected > 0 && !scanning && (
          <div className="threat-status">
            <p>
              ⚠️ {threatsDetected} {threatsDetected === 1 ? 'threat' : 'threats'} detected in your network!
            </p>
          </div>
        )}

        {/* Display "No Threats Detected" with IP Addresses only after scan */}
        {threatsDetected === 0 && !scanning && hasScanned && (
          <p className="no-threats">
            ✅ No threats detected.
            <br />
            <strong>IPv4 Address:</strong> {ipv4Address || 'Not Available'}
            <br />
            <strong>IPv6 Address:</strong> {ipv6Address || 'Not Available'}
          </p>
        )}

        {/* Collapsible Scan Results */}
        {collapseResults && (
          <div className="scan-results">
            {renderScanResults()}
          </div>
        )}

        {!collapseResults && ipInfo && (
          <button className="collapse-button" onClick={() => setCollapseResults(true)}>
            Show Scan Results
          </button>
        )}
      </header>
    </div>
  );
}

export default CyberGuardian;
