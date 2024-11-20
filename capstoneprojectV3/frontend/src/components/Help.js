import React, { useState } from 'react';
import './Help.css';

function Help() {
    const [faqOpen, setFaqOpen] = useState({
        question1: false,
        question2: false,
    });

    const toggleFAQ = (question) => {
        setFaqOpen(prevState => ({
            ...prevState,
            [question]: !prevState[question]
        }));
    };

    return (
        <div className="help-page">
            <h1>Help & Documentation</h1>
            <section>
                <h2>How to Use Threat Detection</h2>
                <p>This page explains how to run threat detection, read logs, and apply filters.</p>
                <div className="video-container">
                    <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/1oyrTwvv7K4?si=zS9xbPoEsTrsFH6V" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </section>
            <section>
                <h2>FAQs</h2>
                <div className="faq-container">
                    <div className="faq-item">
                        <button onClick={() => toggleFAQ('question1')}>
                            1. What is a critical threat? {faqOpen.question1 ? '-' : '+'}
                        </button>
                        {faqOpen.question1 && (
                            <p>
                                A critical threat is a security risk that can have significant consequences, such as data breaches, malware infections, or unauthorized access.
                            </p>
                        )}
                    </div>

                    <div className="faq-item">
                        <button onClick={() => toggleFAQ('question2')}>
                            2. How do I customize my user preferences? {faqOpen.question2 ? '-' : '+'}
                        </button>
                        {faqOpen.question2 && (
                            <p>
                                You can customize your user preferences by going to the settings page, where you can adjust notification settings, filters, and threat detection sensitivity.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Help;
