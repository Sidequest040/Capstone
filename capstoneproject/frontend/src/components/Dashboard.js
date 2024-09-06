import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';
import ThreatDetection from './ThreatDetection';
import ThreatDetectionPage from './ThreatDetectionPage'; 
import Help from './Help'; 
import Profile from './Profile'; 
import DarkMode from './CyberGuardian'; // Renamed from 'App' to 'CyberGuardian'
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
            default:
                return <Overview />;
        }
    };

    return (
        <div className="dashboard">
            <Sidebar setActiveSection={setActiveSection} />
            <div className="content">
                {renderSection()}
            </div>
        </div>
    );
}

export default Dashboard;
