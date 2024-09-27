import React, { useState } from 'react';
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

function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');

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
                <Sidebar setActiveSection={setActiveSection} />
                <div className="content">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
