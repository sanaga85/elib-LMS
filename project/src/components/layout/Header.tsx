import React, { useState } from 'react';
import { Bell, Search, Menu, MessageSquare, Calendar, Award } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuthStore();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Mock notifications
  const notifications = [
    { id: 1, type: 'message', content: 'New message from Dr. Johnson', time: '5 min ago' },
    { id: 2, type: 'deadline', content: 'Assignment due in 2 days', time: '1 hour ago' },
    { id: 3, type: 'achievement', content: 'You earned the "Quick Learner" badge!', time: '3 hours ago' },
    { id: 4, type: 'resource', content: 'New resources added to your course', time: '1 day ago' },
  ];
  
  return (
    <header className="bg-white shadow-md h-16 flex items-center px-4 sticky top-0 z-10">
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
      >
        <Menu size={20} />
      </button>
      
      <form 
        onSubmit={handleSearch}
        className="flex-1 max-w-2xl mx-4"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for resources, courses, etc."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
      
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center mr-2">
          <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
            <span className="font-medium text-indigo-600">Today's Goal:</span> Read 2 chapters
          </div>
        </div>
        
        <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative">
          <Calendar size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative">
          <MessageSquare size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {notification.type === 'message' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare size={16} className="text-blue-600" />
                          </div>
                        )}
                        {notification.type === 'deadline' && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <Calendar size={16} className="text-red-600" />
                          </div>
                        )}
                        {notification.type === 'achievement' && (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Award size={16} className="text-yellow-600" />
                          </div>
                        )}
                        {notification.type === 'resource' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Bell size={16} className="text-green-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-2 flex items-center">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="ml-2 hidden md:block">
            <div className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {user?.role === 'STUDENT' ? 'Level 3 Scholar' : user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;