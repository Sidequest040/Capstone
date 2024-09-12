import React from 'react';
import './TechnicalPlans.css';

function TechnicalPlans() {
    return (
        <div className="technical-plans-page">
            <div className="technical-card">
                <div className="technical-card_title__container">
                    <h2 className="card_title">Technical Process Plans</h2>
                </div>
                <p className="technical-card_paragraph">
                    The development of this AI-powered cybersecurity tool involves several key technical components:
                </p>
                <div className="line"></div>
                <ul className="technical-card__list">
                    <li className="technical-card__list_item">
                        <span className="list_text">Backend: Node.js with Express for handling API requests.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <span className="list_text">Frontend: React.js for building an interactive user interface.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <span className="list_text">Database: MySQL for storing user data and threat logs.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <span className="list_text">AI Usage: Integration with AI models like ChatGPT for real-time threat detection and analysis.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <span className="list_text">Deployment: Docker and Kubernetes for containerization and orchestration.</span>
                    </li>
                </ul>
                <p className="technical-card_paragraph">
                    Infrastructure setup will be managed using Terraform, and continuous integration will be implemented with Jenkins.
                </p>
            </div>
        </div>
    );
}

export default TechnicalPlans;
