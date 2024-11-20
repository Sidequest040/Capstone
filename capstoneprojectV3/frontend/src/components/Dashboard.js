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
import DarkMode from './CyberGuardian';
import SplineViewer from './SplineViewer'; // Import the Spline Viewer
import ClearingCacheTool from './ClearingCacheTool';
import './Dashboard.css';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
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
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

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
        return <DarkMode />;
      case 'clearing-cache':
        return <ClearingCacheTool />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* 3D Spline Background */}
      <div className="spline-container">
        <SplineViewer url={process.env.REACT_APP_SPLINE_VIEWER_URL} />
      </div>
      <div className="dashboard-content">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="content">{renderSection()}</div>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
