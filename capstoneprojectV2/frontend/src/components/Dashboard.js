// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';
import ThreatDetection from './ThreatDetection';
import ThreatDetectionPage from './ThreatDetectionPage'; 
import Help from './Help'; 
import Profile from './Profile'; 
import DarkMode from './CyberGuardian'; // Renamed from 'App' to 'CyberGuardian'
import SplineViewer from './SplineViewer'; // Import the Spline Viewer
import ClearingCacheTool from './ClearingCacheTool'; // Import the renamed component

import './Dashboard.css';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('overview'); // State for active section
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // If no token, redirect to login
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
          headers: {
            Authorization: token,
          },
        });
        setMessage(res.data.message);
      } catch (error) {
        setMessage('You are not authorized to access this content');
        localStorage.removeItem('token'); // Remove invalid token
        navigate('/login'); // Redirect to login
      }
    };

    fetchData();
  }, [navigate]);

  // Function to render the appropriate section
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'technical':
        return <TechnicalPlans />;
      case 'threat-detection':
        return <ThreatDetection />;
      case 'threat-detection-page':
        return <ThreatDetectionPage />;
      case 'help':
        return <Help />;
      case 'profile':
        return <Profile />;
      case 'dark-mode':
        return <DarkMode />; // Now CyberGuardian component
      case 'clearing-cache': // Update case for clearing cache tool
        return <ClearingCacheTool />; // Correct spelling here
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Spline Viewer for 3D Background */}
      <div className="spline-container">
        <SplineViewer url={process.env.REACT_APP_SPLINE_VIEWER_URL} />
        {/* Optional Overlay */}
        <div className="spline-overlay"></div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <Sidebar setActiveSection={setActiveSection} /> {/* Sidebar for navigation */}
        <div className="content">
          {renderSection()} {/* Render active section */}
        </div>
      </div>

      {/* Optionally display the message from the backend */}
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
