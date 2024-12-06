import React, { useState } from 'react';
import './Help.css';

function Help() {
    const [faqOpen, setFaqOpen] = useState({
        question1: false,
        question2: false,
    });

    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleFAQ = (question) => {
        setFaqOpen(prevState => ({
            ...prevState,
            [question]: !prevState[question]
        }));
    };

    // Array of possible responses to ensure unique answers.
    const botResponses = [
`FAQs
1. What is a critical threat?
A critical threat is a security risk that can have serious consequences, such as data breaches, malware, or unauthorized access.

2. How do I customize my user preferences?
You can navigate to the settings page to adjust notification settings, filters, and threat detection sensitivity.

Help Bot
Cybersecurity is essential because it helps prevent malicious attacks that could compromise sensitive data. By maintaining strong cyber defenses, organizations protect their systems and foster trust with their users.`,

`FAQs
1. What is a critical threat?
A critical threat represents a high-level security risk that might involve system exploitation or unauthorized data exposure.

2. How do I customize my user preferences?
Head over to the settings page to configure threat filters, notification intervals, and other security parameters.

Help Bot
Strong cybersecurity practices are the backbone of modern digital safety. They help guard against both internal and external threats, ensuring data remains confidential and systems remain stable.`,

`FAQs
1. What is a critical threat?
It's a severe vulnerability that attackers might exploit to gain unauthorized access, spread malware, or steal valuable information.

2. How do I customize my user preferences?
By visiting the settings page, you can tweak alert frequencies, update threat filters, and personalize your cybersecurity approach.

Help Bot
Robust cybersecurity measures are vital in today's interconnected world. They keep your infrastructure safe, reduce the likelihood of breaches, and preserve the integrity of your data and services.`,

`FAQs
1. What is a critical threat?
A critical threat is a severe security risk that, if not addressed promptly, can result in major incidents like data theft or system damage.

2. How do I customize my user preferences?
In the settings page, you can adjust filters, notification types, and detection sensitivity to match your security needs.

Help Bot
By prioritizing cybersecurity, you protect not only your assets but also the trust and confidence of your users. Implementing solid cybersecurity measures helps ensure a safe digital environment for everyone involved.`
    ];

    // Function to get a random response from the array
    const getBotResponse = () => {
        const randomIndex = Math.floor(Math.random() * botResponses.length);
        return botResponses[randomIndex];
    };

    const handleSend = () => {
        if (chatInput.trim() === '') return;

        // Add user message
        setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
        setChatInput('');
        setLoading(true);

        // Get a random bot response from the list
        const botResponse = getBotResponse();

        // Simulate a delay before responding
        setTimeout(() => {
            setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
            setLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
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

            <section className="help-bot-section">
                <h2>Help Bot</h2>
                <div className="chat-container">
                    <div className="chat-messages">
                        {chatMessages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`chat-message ${msg.sender === 'bot' ? 'bot' : 'user'}`}
                            >
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message bot">
                                <p>Thinking...</p>
                            </div>
                        )}
                    </div>
                    <div className="chat-input-container">
                        <input 
                            type="text" 
                            value={chatInput} 
                            onChange={(e) => setChatInput(e.target.value)} 
                            onKeyPress={handleKeyPress}
                            placeholder="Ask the help bot a question..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Help;
