import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Check if user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming you're storing a token
    if (!token) {
      navigate('/'); // Redirect to login if no token
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    // Clear the token and any other session data
    localStorage.removeItem('token');
    
    // Redirect to login
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>
      <p>This is a protected route. Only logged-in users can see this.</p>
      
      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
