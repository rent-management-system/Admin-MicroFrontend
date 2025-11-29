import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session data (e.g., token, user info) from local storage
    localStorage.clear();
    console.log('User session cleared from local storage.');

    // Redirect to the specified external URL
    // Using window.location.href to ensure a full page reload and clear potential React state
    window.location.href = 'https://rental-user-management-frontend-sigma.vercel.app/';
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Logging Out...</h2>
        <p className="text-gray-600">You are being redirected to the login page.</p>
      </div>
    </div>
  );
};

export default Logout;
