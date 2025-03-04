import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  School, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut,
  Home,
  BookMarked,
  GraduationCap,
  ClipboardList,
  Sparkles,
  Trophy,
  Calendar,
  Lightbulb,
  Target,
  CheckSquare,
  Download,
  HardDrive,
  WifiOff,
  Key
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import InstitutionSwitcher from './InstitutionSwitcher';

const Sidebar: React.FC = () => {
  const { user, hasPermission, logout } = useAuthStore();
  
  if (!user) return null;

  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col">
      <div className="p-5 border-b border-indigo-700 bg-indigo-950 shadow-md">
        <h2 className="text-xl font-bold flex items-center">
          <BookOpen className="mr-2 text-indigo-300" />
          <span className="bg-gradient-to-r from-white to-indigo-200 text-transparent bg-clip-text">
            E-Library LMS
          </span>
        </h2>
      </div>
      
      {hasPermission(['SUPER_ADMIN']) && (
        <div className="px-4 py-2 border-b border-indigo-700 bg-indigo-900/50">
          <InstitutionSwitcher />
        </div>
      )}
      
      <div className="p-5 border-b border-indigo-700 bg-indigo-900/50">
        <div className="text-sm text-indigo-300">{getTimeBasedGreeting()}</div>
        <div className="font-medium text-lg">{user.firstName} {user.lastName}</div>
        <div className="text-xs bg-indigo-700 rounded-full px-3 py-1 mt-1 inline-block shadow-sm">
          {user.role}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-indigo-800/40 border-b border-indigo-700">
        <div className="flex items-center text-sm text-indigo-200">
          <Sparkles size={14} className="mr-2 text-yellow-400" />
          <div className="font-medium">Daily Inspiration</div>
        </div>
        <div className="text-xs mt-1 italic text-indigo-100">
          "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/library" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <BookOpen size={18} className="mr-3" />
              E-Library
            </NavLink>
          </li>
          
          {hasPermission(['FACULTY', 'ADMIN', 'SUPER_ADMIN']) && (
            <li>
              <NavLink 
                to="/courses" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 shadow-md text-white' 
                      : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                  }`
                }
              >
                <GraduationCap size={18} className="mr-3" />
                Courses
              </NavLink>
            </li>
          )}
          
          {hasPermission(['STUDENT']) && (
            <li>
              <NavLink 
                to="/my-courses" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 shadow-md text-white' 
                      : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                  }`
                }
              >
                <GraduationCap size={18} className="mr-3" />
                My Courses
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink 
              to="/bookmarks" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <BookMarked size={18} className="mr-3" />
              Bookmarks
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/calendar" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <Calendar size={18} className="mr-3" />
              Calendar
              <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </NavLink>
          </li>
          
          {hasPermission(['FACULTY', 'ADMIN', 'SUPER_ADMIN']) && (
            <li>
              <NavLink 
                to="/quizzes" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 shadow-md text-white' 
                      : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                  }`
                }
              >
                <ClipboardList size={18} className="mr-3" />
                Quizzes
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink 
              to="/achievements" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <Trophy size={18} className="mr-3 text-yellow-400" />
              Achievements
              {hasPermission(['STUDENT']) && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
              )}
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/progress" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <Target size={18} className="mr-3 text-green-400" />
              Progress Tracker
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/study-groups" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <Lightbulb size={18} className="mr-3 text-yellow-300" />
              Study Groups
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/settings/offline" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 shadow-md text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                }`
              }
            >
              <HardDrive size={18} className="mr-3 text-blue-300" />
              Offline Access
            </NavLink>
          </li>
          
          {hasPermission(['ADMIN', 'SUPER_ADMIN']) && (
            <>
              <li className="pt-4 pb-1">
                <div className="text-xs uppercase text-indigo-400 font-semibold px-2 mb-1">
                  Administration
                </div>
              </li>
              
              {hasPermission(['SUPER_ADMIN']) && (
                <>
                  <li>
                    <NavLink 
                      to="/institutions" 
                      className={({ isActive }) => 
                        `flex items-center p-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-indigo-700 shadow-md text-white' 
                            : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                        }`
                      }
                    >
                      <School size={18} className="mr-3" />
                      Institutions
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink 
                      to="/admin/api-management" 
                      className={({ isActive }) => 
                        `flex items-center p-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-indigo-700 shadow-md text-white' 
                            : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                        }`
                      }
                    >
                      <Key size={18} className="mr-3" />
                      API Management
                    </NavLink>
                  </li>
                </>
              )}
              
              <li>
                <NavLink 
                  to="/users" 
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-700 shadow-md text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                    }`
                  }
                >
                  <Users size={18} className="mr-3" />
                  Users
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/resources" 
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-700 shadow-md text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                    }`
                  }
                >
                  <FileText size={18} className="mr-3" />
                  Resources
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/analytics" 
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-700 shadow-md text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                    }`
                  }
                >
                  <BarChart2 size={18} className="mr-3" />
                  Analytics
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/implementation-status" 
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-700 shadow-md text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                    }`
                  }
                >
                  <CheckSquare size={18} className="mr-3" />
                  Implementation Status
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-700 shadow-md text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800/70 hover:text-white'
                    }`
                  }
                >
                  <Settings size={18} className="mr-3" />
                  Settings
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-indigo-700 bg-indigo-900/30">
        <div className="text-xs text-indigo-300 mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            <span>Study streak: 5 days</span>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center w-full p-2 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;