import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';
import ThreatDetection from './ThreatDetection';
import ThreatDetectionPage from './ThreatDetectionPage'; 
import Help from './Help'; // Import the Help component
import Profile from './Profile'; // Import the Profile component
import App from './App'; // Import App for Dark Mode functionality
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
                return <Help />; // Render Help section
            case 'profile':
                return <Profile />; // Render Profile section
            case 'app':
                return <App />; // Render the dark mode toggle app section
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
