import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthWrapper() {
    return (
        <div className="auth-wrapper">
            {/* Spline 3D Background */}
            <iframe 
                src='https://my.spline.design/bganimation-69697d5c61bc71d5fc8a78d6f7ac055d/' 
                frameBorder='0' 
                width='100%' 
                height='100%' 
                style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
                title="3D background animation"  // Added title for accessibility
            ></iframe>

            {/* Render the child route (Login or Signup) */}
            <Outlet />
        </div>
    );
}

export default AuthWrapper;
