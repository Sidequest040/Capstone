// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
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

function App() {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [geoInfo, setGeoInfo] = useState(null);
  const [threatInfo, setThreatInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIpData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch IPv4 address
      let ipv4Address = null;
      try {
        const ipv4Response = await axios.get('https://api.ipify.org?format=json');
        ipv4Address = ipv4Response.data.ip;
      } catch (err) {
        console.warn('IPv4 address not available:', err.message);
      }

      // Fetch IPv6 address
      let ipv6Address = null;
      try {
        const ipv6Response = await axios.get('https://api64.ipify.org?format=json');
        ipv6Address = ipv6Response.data.ip;
      } catch (err) {
        console.warn('IPv6 address not available:', err.message);
      }

      // Collect available IP addresses
      const ips = [];
      if (ipv4Address) ips.push({ type: 'IPv4', ip: ipv4Address });
      if (ipv6Address) ips.push({ type: 'IPv6', ip: ipv6Address });

      if (ips.length === 0) {
        setError('Unable to retrieve IPv4 or IPv6 address.');
        setLoading(false);
        return;
      }

      setIpAddresses(ips);

      // Use one of the IPs to fetch geolocation data
      const geoResponse = await axios.get(`https://ipapi.co/${ips[0].ip}/json/`);
      const {
        city,
        region,
        country_code: country,
        latitude,
        longitude,
      } = geoResponse.data;
      setGeoInfo({ city, region, country, latitude, longitude });

      // Fetch threat analysis using one of the IPs
      const threatResponse = await axios.get(
        'https://obscure-trout-jjrvqq45g96pf5q47-5000.app.github.dev/check-ip',
        {
          params: { ip: ips[0].ip },
        }
      );
      setThreatInfo(threatResponse.data);
    } catch (error) {
      console.error(
        'Error fetching the IP information:',
        error.response ? error.response.data : error.message
      );
      setError('Error fetching IP information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Get Your IP Information</h1>
      <button className="button" onClick={fetchIpData} disabled={loading}>
        {loading ? 'Fetching...' : 'Get IP Info'}
      </button>

      {error && <p className="error">{error}</p>}

      {ipAddresses.length > 0 && geoInfo && !error && (
        <div className="info-container">
          <div className="info-section">
            <h2>Your IP Addresses:</h2>
            {ipAddresses.map((ipObj) => (
              <p className="info" key={ipObj.ip}>
                {ipObj.type}: {ipObj.ip}
              </p>
            ))}

            <p className="info">
              <strong>City:</strong> {geoInfo.city || 'N/A'}
            </p>
            <p className="info">
              <strong>Region:</strong> {geoInfo.region || 'N/A'}
            </p>
            <p className="info">
              <strong>Country:</strong> {geoInfo.country || 'N/A'}
            </p>
          </div>

          {geoInfo.latitude && geoInfo.longitude && (
            <div className="map-card">
              <MapContainer
                center={[geoInfo.latitude, geoInfo.longitude]}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[geoInfo.latitude, geoInfo.longitude]}>
                  <Popup>
                    {geoInfo.city}, {geoInfo.region}, {geoInfo.country}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {threatInfo && (
            <div className="info-section">
              <h2>Threat Analysis</h2>
              <p className="info">
                <strong>Fraud Score:</strong> {threatInfo.fraud_score}
              </p>
              <p className="info">
                <strong>Is Proxy:</strong> {threatInfo.proxy ? 'Yes' : 'No'}
              </p>
              <p className="info">
                <strong>Is VPN:</strong> {threatInfo.vpn ? 'Yes' : 'No'}
              </p>
              <p className="info">
                <strong>Is Tor:</strong> {threatInfo.tor ? 'Yes' : 'No'}
              </p>
              <p className="info">
                <strong>Recent Abuse:</strong> {threatInfo.recent_abuse ? 'Yes' : 'No'}
              </p>
              <p className="info">
                <strong>Bot Status:</strong> {threatInfo.bot_status ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
