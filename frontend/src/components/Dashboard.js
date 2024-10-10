import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {

  const [isopen, setIsopen] = useState(false);
  const navigate = useNavigate();
  return (
  <>
    <div className="flex flex-col items-center justify-center mt-32">
      
      <div className="p-10 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out text-center">
        <h1 className="lg:text-5xl sm: text-3xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
          Welcome to Admin Panel
        </h1>
        <p className="mt-4 text-gray-700 lg:text-lg sm: text-xs text-center">
          Manage users, employees, and more from your dashboard.
        </p>
      </div>

      <button className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out" onClick={() => navigate('/employee-list')}>
        Let's Begin
      </button>
    </div>
    </>
  );
};
