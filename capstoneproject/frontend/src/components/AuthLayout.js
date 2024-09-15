import React from 'react';
import { Outlet } from 'react-router-dom';
import SplineViewer from './SplineViewer';
import './Login.css'; // Reuse the same CSS

function AuthLayout() {
    return (
        <div className="login-container">
            {/* Spline Viewer */}
            <div className="spline-container">
                <SplineViewer url="https://prod.spline.design/Epf-r-eipmqLFoMY/scene.splinecode" />
                {/* Optional Overlay */}
                <div className="spline-overlay"></div>
            </div>

            {/* Render the Login or Signup form */}
            <Outlet />
        </div>
    );
}

export default AuthLayout;
