import React from 'react';
import './Overview.css';

function Overview() {
    return (
        <div className="card">
            <div className="card__border"></div>
            <div className="card_title__container">
                <h2 className="card_title">Project Overview</h2>
                <p className="card_paragraph">
                    This project aims to develop a robust AI-powered tool for cybersecurity threat detection and response.
                    Leveraging advanced machine learning algorithms, the tool will identify and mitigate potential security threats in real-time.
                </p>
            </div>
            <hr className="line" />
            <ul className="card__list">
                <li className="card__list_item">
                    <span className="check">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span className="list_text">Real-time threat detection</span>
                </li>
                <li className="card__list_item">
                    <span className="check">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span className="list_text">Automated response mechanisms</span>
                </li>
                <li className="card__list_item">
                    <span className="check">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span className="list_text">Comprehensive reporting tools</span>
                </li>
                <li className="card__list_item">
                    <span className="check">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span className="list_text">Scalable infrastructure</span>
                </li>
            </ul>
        </div>
    );
}

export default Overview;
