import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Clock, 
  BookMarked,
  BarChart2,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Target,
  Zap,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - would be replaced with actual API calls
  const stats = {
    totalResources: 1250,
    totalUsers: 850,
    totalCourses: 45,
    recentlyAccessed: [
      { id: '1', title: 'Introduction to Machine Learning', type: 'PDF', accessedAt: '2 hours ago' },
      { id: '2', title: 'Advanced Database Systems', type: 'VIDEO', accessedAt: '1 day ago' },
      { id: '3', title: 'Principles of Economics', type: 'PDF', accessedAt: '3 days ago' },
    ],
    popularResources: [
      { id: '1', title: 'Introduction to Machine Learning', type: 'PDF', accessCount: 245 },
      { id: '2', title: 'Advanced Database Systems', type: 'VIDEO', accessCount: 189 },
      { id: '3', title: 'Principles of Economics', type: 'PDF', accessCount: 156 },
    ],
    upcomingDeadlines: [
      { id: '1', title: 'Data Structures Quiz', course: 'Computer Science 101', dueDate: '2023-10-15' },
      { id: '2', title: 'Literature Review', course: 'English Literature', dueDate: '2023-10-20' },
    ],
    achievements: [
      { id: '1', title: 'Quick Learner', description: 'Completed 5 courses in a month', icon: <Zap className="h-5 w-5 text-yellow-500" /> },
      { id: '2', title: 'Bookworm', description: 'Read 20 resources', icon: <BookOpen className="h-5 w-5 text-indigo-500" /> },
      { id: '3', title: 'Perfect Score', description: 'Scored 100% on a quiz', icon: <Award className="h-5 w-5 text-purple-500" /> },
    ],
    studyStreak: {
      current: 5,
      longest: 14,
      thisWeek: [true, true, true, true, true, false, false],
    },
    learningGoals: [
      { id: '1', title: 'Complete Machine Learning Course', progress: 65 },
      { id: '2', title: 'Read 10 Academic Papers', progress: 30 },
      { id: '3', title: 'Practice Python Daily', progress: 80 },
    ],
    announcements: [
      { id: '1', title: 'New AI Course Available', content: 'Check out our new course on Artificial Intelligence fundamentals.', date: '2023-10-10' },
      { id: '2', title: 'System Maintenance', content: 'The system will be down for maintenance on Sunday from 2-4 AM.', date: '2023-10-12' },
    ]
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get motivational message based on user role
  const getMotivationalMessage = () => {
    if (hasPermission(['STUDENT'])) {
      return "Ready to expand your knowledge today?";
    } else if (hasPermission(['FACULTY'])) {
      return "Your guidance shapes the future. What will you teach today?";
    } else {
      return "Your leadership drives educational excellence forward.";
    }
  };
  
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}, {user?.firstName}!</h1>
        <p className="text-indigo-100">{getMotivationalMessage()}</p>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'progress' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            My Progress
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'calendar' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            Calendar
          </button>
          {hasPermission(['ADMIN', 'SUPER_ADMIN']) && (
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-white text-indigo-700 shadow-md' 
                  : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
              }`}
            >
              Analytics
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {hasPermission(['ADMIN', 'SUPER_ADMIN']) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="rounded-full bg-indigo-100 p-3 mr-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold">{stats.totalResources}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" /> 12% increase
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" /> 8% increase
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold">{stats.totalCourses}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" /> 5% increase
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {hasPermission(['STUDENT']) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="mr-2 text-indigo-600" size={20} />
                Learning Goals
              </h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                {stats.learningGoals.map(goal => (
                  <div key={goal.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                      <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <button className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  <Zap size={16} className="mr-1" /> Add New Goal
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="mr-2 text-indigo-600" size={18} />
                  Recently Accessed
                </h2>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {stats.recentlyAccessed.map((item) => (
                    <li key={item.id} className="py-4 flex group">
                      <div className="rounded-md bg-gray-100 p-2 mr-4 group-hover:bg-indigo-100 transition-colors">
                        <Clock className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">{item.title}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {item.accessedAt}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 bg-white rounded p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <BookMarked className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <a href="/library" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    View all resources <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
            
            {hasPermission(['ADMIN', 'SUPER_ADMIN']) ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart2 className="mr-2 text-blue-600" size={18} />
                    Popular Resources
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {stats.popularResources.map((item) => (
                      <li key={item.id} className="py-4 flex group">
                        <div className="rounded-md bg-gray-100 p-2 mr-4 group-hover:bg-blue-100 transition-colors">
                          <BarChart2 className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {item.type}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {item.accessCount} views
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <a href="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                      View analytics <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="mr-2 text-red-600" size={18} />
                    Upcoming Deadlines
                  </h2>
                </div>
                <div className="p-6">
                  {stats.upcomingDeadlines.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {stats.upcomingDeadlines.map((item) => (
                        <li key={item.id} className="py-4 flex group">
                          <div className="rounded-md bg-red-100 p-2 mr-4 group-hover:bg-red-200 transition-colors">
                            <Clock className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-red-700 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.course}</p>
                            <p className="text-xs font-medium text-red-600 mt-1 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">All caught up!</p>
                      <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <a href="/calendar" className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center">
                      View calendar <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {hasPermission(['STUDENT']) && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Award className="mr-2 text-yellow-600" size={18} />
                    Achievements
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {stats.achievements.map((item) => (
                      <li key={item.id} className="py-3 flex items-center group">
                        <div className="rounded-full bg-yellow-100 p-2 mr-3 group-hover:bg-yellow-200 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <a href="/achievements" className="text-sm font-medium text-yellow-600 hover:text-yellow-800 flex items-center">
                      View all achievements <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg ${hasPermission(['STUDENT']) ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="mr-2 text-purple-600" size={18} />
                  Announcements
                </h2>
              </div>
              <div className="p-6">
                {stats.announcements.map((item) => (
                  <div key={item.id} className="mb-4 last:mb-0 p-4 border border-purple-100 rounded-lg hover:border-purple-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-medium text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/library" className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <BookOpen className="h-8 w-8 text-indigo-600 mx-auto group-hover:text-indigo-700 transition-colors" />
                <p className="mt-2 text-sm font-medium text-indigo-900">Browse Library</p>
              </a>
              
              <a href="/bookmarks" className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <BookMarked className="h-8 w-8 text-green-600 mx-auto group-hover:text-green-700 transition-colors" />
                <p className="mt-2 text-sm font-medium text-green-900">My Bookmarks</p>
              </a>
              
              <a href={hasPermission(['STUDENT']) ? "/my-courses" : "/courses"} className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <GraduationCap className="h-8 w-8 text-purple-600 mx-auto group-hover:text-purple-700 transition-colors" />
                <p className="mt-2 text-sm font-medium text-purple-900">
                  {hasPermission(['STUDENT']) ? "My Courses" : "Courses"}
                </p>
              </a>
              
              <a href={hasPermission(['ADMIN', 'SUPER_ADMIN']) ? "/analytics" : "/study-groups"} className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md group">
                {hasPermission(['ADMIN', 'SUPER_ADMIN']) ? (
                  <>
                    <BarChart2 className="h-8 w-8 text-blue-600 mx-auto group-hover:text-blue-700 transition-colors" />
                    <p className="mt-2 text-sm font-medium text-blue-900">Analytics</p>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-8 w-8 text-blue-600 mx-auto group-hover:text-blue-700 transition-colors" />
                    <p className="mt-2 text-sm font-medium text-blue-900">Study Groups</p>
                  </>
                )}
              </a>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Journey</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Study Streak</h3>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 text-indigo-800 rounded-lg px-4 py-2 flex items-center mr-4">
                <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                <div>
                  <div className="text-xs text-indigo-600">Current Streak</div>
                  <div className="text-xl font-bold">{stats.studyStreak.current} days</div>
                </div>
              </div>
              <div className="bg-purple-100 text-purple-800 rounded-lg px-4 py-2 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                <div>
                  <div className="text-xs text-purple-600">Longest Streak</div>
                  <div className="text-xl font-bold">{stats.studyStreak.longest} days</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-xs text-center flex-1">{day}</div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              {stats.studyStreak.thisWeek.map((active, index) => (
                <div 
                  key={index} 
                  className={`h-8 rounded-md flex-1 flex items-center justify-center ${
                    active 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                      : index >= new Date().getDay() 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-red-100 text-red-500'
                  }`}
                >
                  {active ? <CheckCircle size={16} /> : null}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Learning Goals</h3>
            {stats.learningGoals.map(goal => (
              <div key={goal.id} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      goal.progress < 30 
                        ? 'bg-red-600' 
                        : goal.progress < 70 
                          ? 'bg-yellow-600' 
                          : 'bg-green-600'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Schedule</h2>
          <p className="text-gray-600 mb-4">Calendar view will be implemented here.</p>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-2 text-center font-medium text-indigo-800 border-b">
              October 2023
            </div>
            <div className="grid grid-cols-7 text-center border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2 text-xs font-medium text-gray-500">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Start from previous month
                return (
                  <div 
                    key={i} 
                    className={`py-3 border-t border-r ${i % 7 === 0 ? '' : ''} ${
                      day > 0 && day <= 31 
                        ? 'text-gray-700 hover:bg-indigo-50 cursor-pointer' 
                        : 'text-gray-300 bg-gray-50'
                    } ${day === 15 ? 'bg-red-50' : ''} ${day === 20 ? 'bg-yellow-50' : ''}`}
                  >
                    {day > 0 && day <= 31 ? day : ''}
                    {day === 15 && <div className="w-1 h-1 bg-red-500 rounded-full mx-auto mt-1"></div>}
                    {day === 20 && <div className="w-1 h-1 bg-yellow-500 rounded-full mx-auto mt-1"></div>}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 border border-red-100 rounded-lg bg-red-50">
                <Calendar className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Data Structures Quiz</p>
                  <p className="text-xs text-gray-600">Computer Science 101</p>
                  <p className="text-xs text-red-600 mt-1">October 15, 2023 • 10:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 border border-yellow-100 rounded-lg bg-yellow-50">
                <Calendar className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Literature Review</p>
                  <p className="text-xs text-gray-600">English Literature</p>
                  <p className="text-xs text-yellow-600 mt-1">October 20, 2023 • 11:59 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && hasPermission(['ADMIN', 'SUPER_ADMIN']) && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics Dashboard</h2>
          <p className="text-gray-600 mb-6">Detailed analytics will be implemented here.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">User Activity</h3>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">User activity chart will be displayed here</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Resource Usage</h3>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Resource usage chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;