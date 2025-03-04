import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MotivationalQuote from './MotivationalQuote';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show motivational quote on initial load
  useEffect(() => {
    const hasSeenQuote = sessionStorage.getItem('hasSeenQuote');
    if (!hasSeenQuote) {
      setTimeout(() => {
        setShowQuote(true);
        sessionStorage.setItem('hasSeenQuote', 'true');
      }, 1000);
    }
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300" onClick={toggleSidebar}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full transform transition-all duration-300 ease-in-out">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Sidebar />
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-indigo-50/30">
          <Outlet />
        </main>
      </div>

      {/* Motivational Quote Modal */}
      {showQuote && <MotivationalQuote onClose={() => setShowQuote(false)} />}
    </div>
  );
};

export default Layout;