import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Removed unused imports for a cleaner file
// Import performance metrics if needed
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Added logging for better debugging during builds
console.log("Initializing React application...");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance reporting
if (process.env.NODE_ENV === 'production') {
  reportWebVitals((metric) => {
    console.log(metric); // Log performance metrics during production builds
  });
}
