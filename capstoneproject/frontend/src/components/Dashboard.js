import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';
import ThreatDetection from './ThreatDetection'; // Import the new ThreatDetection component
import './Dashboard.css';

function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <Overview />;
            case 'technical':
                return <TechnicalPlans />;
            case 'threat-detection':  // Add this case to render the Threat Detection section
                return <ThreatDetection />;
            // Add more cases for additional sections
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
