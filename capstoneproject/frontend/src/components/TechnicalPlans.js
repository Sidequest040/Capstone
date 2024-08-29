import React from 'react';
import './Dashboard.css';

function TechnicalPlans() {
    return (
        <div>
            <h2>Technical Process Plans</h2>
            <p>
                The development of this AI-powered cybersecurity tool involves several key technical components:
                <ul>
                    <li>Backend: Node.js with Express for handling API requests.</li>
                    <li>Frontend: React.js for building an interactive user interface.</li>
                    <li>Database: MySQL for storing user data and threat logs.</li>
                    <li>Machine Learning: Python-based algorithms for real-time threat detection.</li>
                    <li>Deployment: Docker and Kubernetes for containerization and orchestration.</li>
                </ul>
            </p>
            <p>
                Infrastructure setup will be managed using Terraform, and continuous integration will be implemented with Jenkins.
            </p>
        </div>
    );
}

export default TechnicalPlans;
