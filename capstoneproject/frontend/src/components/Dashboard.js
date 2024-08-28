import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Content from './Content';  // This would be where you load your sections like Overview, TechnicalPlans, etc.
import './Dashboard.css';

function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="dashboard">
            <Sidebar setActiveSection={setActiveSection} />
            <Content activeSection={activeSection} />
        </div>
    );
}

export default Dashboard;
