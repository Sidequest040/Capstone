import React from 'react';
import './TechnicalPlans.css';

function TechnicalPlans() {
    return (
        <div className="technical-plans-page">
            <div className="technical-card">
                <div className="technical-card_title__container">
                    <h2 className="card_title">Security Plans</h2>
                </div>
                <p className="technical-card_paragraph">
                    The development of this AI-powered cybersecurity tool involves several key technical components:
                </p>
                <div className="line"></div>
                <ul className="technical-card__list">
                    <li className="technical-card__list_item">
                        <div className="check">
                            <svg className="check_svg" viewBox="0 0 16 16">
                                <path d="M13.485 1.929l-7.778 7.778-3.536-3.535-1.414 1.414 4.95 4.95 9.192-9.192z"/>
                            </svg>
                        </div>
                        <span className="list_text"><strong>Backend</strong>: Node.js with Express for handling API requests.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <div className="check">
                            <svg className="check_svg" viewBox="0 0 16 16">
                                <path d="M13.485 1.929l-7.778 7.778-3.536-3.535-1.414 1.414 4.95 4.95 9.192-9.192z"/>
                            </svg>
                        </div>
                        <span className="list_text"><strong>Frontend</strong>: React.js for building an interactive user interface.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <div className="check">
                            <svg className="check_svg" viewBox="0 0 16 16">
                                <path d="M13.485 1.929l-7.778 7.778-3.536-3.535-1.414 1.414 4.95 4.95 9.192-9.192z"/>
                            </svg>
                        </div>
                        <span className="list_text"><strong>Database</strong>: MySQL for storing user data and threat logs.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <div className="check">
                            <svg className="check_svg" viewBox="0 0 16 16">
                                <path d="M13.485 1.929l-7.778 7.778-3.536-3.535-1.414 1.414 4.95 4.95 9.192-9.192z"/>
                            </svg>
                        </div>
                        <span className="list_text"><strong>AI Integration</strong>: Utilizing AI models like ChatGPT for real-time threat detection and analysis.</span>
                    </li>
                    <li className="technical-card__list_item">
                        <div className="check">
                            <svg className="check_svg" viewBox="0 0 16 16">
                                <path d="M13.485 1.929l-7.778 7.778-3.536-3.535-1.414 1.414 4.95 4.95 9.192-9.192z"/>
                            </svg>
                        </div>
                        <span className="list_text"><strong>Deployment</strong>: Docker for containerization and orchestration.</span>
                    </li>
                </ul>
                <p className="technical-card_paragraph">
                    The infrastructure setup and continuous integration processes are designed to ensure seamless deployment and scalability.
                </p>
            </div>
        </div>
    );
}

export default TechnicalPlans;
