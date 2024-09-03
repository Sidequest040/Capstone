import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ThreatDetectionPage from './components/ThreatDetectionPage';
import ThreatDetection from './components/ThreatDetection';
import { ThreatProvider } from './components/ThreatContext';  // Import the ThreatProvider

function App() {
    return (
        <ThreatProvider>  {/* Wrap your app in the provider */}
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/threat-detection-page" element={<ThreatDetectionPage />} />  {/* Add new route */}
                    <Route path="/threat-detection" element={<ThreatDetection />} />  {/* Add new route */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </ThreatProvider>
    );
}

export default App;
