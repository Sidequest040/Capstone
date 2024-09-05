import React from 'react';
import './Help.css';

function Help() {
    return (
        <div className="help-page">
            <h1>Help & Documentation</h1>
            <section>
                <h2>How to Use Threat Detection</h2>
                <p>This page explains how to run threat detection, read logs, and apply filters.</p>
                {/* Embed YouTube video */}
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/22ENqTHVSS4?si=C04YPIo_yerdu-U6" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </section>
            <section>
                <h2>FAQs</h2>
                <p>1. What is a critical threat?</p>
                <p>2. How do I customize my user preferences?</p>
            </section>
        </div>
    );
}

export default Help;
