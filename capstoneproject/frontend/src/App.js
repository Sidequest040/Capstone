import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ThreatDetectionPage from './components/ThreatDetectionPage';
import ThreatDetection from './components/ThreatDetection';
import { ThreatProvider } from './components/ThreatContext';

function App() {
    return (
        <ThreatProvider> {/* Wrap your app in the provider */}
            <Router>
                <Routes>
                    {/* Login and Signup pages */}
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />

                    {/* Other pages that don't require the 3D background */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/threat-detection-page" element={<ThreatDetectionPage />} />
                    <Route path="/threat-detection" element={<ThreatDetection />} />
                    
                    {/* Default route to Login */}
                    <Route path="/" element={<Login />} />

                    {/* Redirect to login if no other path matches */}
                    <Route path="*" element={<Login />} />
                </Routes>
            </Router>
        </ThreatProvider>
    );
}

export default App;
