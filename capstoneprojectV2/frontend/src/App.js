import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './components/Login';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard';
import ThreatDetectionPage from './components/ThreatDetectionPage';
import ThreatDetection from './components/ThreatDetection';
import SplineViewer from './components/SplineViewer'; // Import SplineViewer
import { ThreatProvider } from './components/ThreatContext';

function App() {
  return (
    <ThreatProvider>
      {/* The Spline background will stay persistent across all routes */}
      <div className="app-container">
        <SplineViewer url={process.env.REACT_APP_SPLINE_VIEWER_URL} /> {/* The 3D background */}
        
        <Router>
          <Routes>
            {/* Auth routes (login/signup) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Login />} />
            </Route>

            {/* Other routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/threat-detection-page" element={<ThreatDetectionPage />} />
            <Route path="/threat-detection" element={<ThreatDetection />} />

            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </ThreatProvider>
  );
}

export default App;
