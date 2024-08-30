import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';
import ThreatDetection from './ThreatDetection';
import ThreatDetectionPage from './ThreatDetectionPage'; // Import the new component
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
            case 'threat-detection-page': // Add this case to render the new Threat Detection Page
                return <ThreatDetectionPage />;
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
