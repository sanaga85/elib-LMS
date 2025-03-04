import React, { useState } from 'react';
import { 
  BarChart2, 
  Users, 
  BookOpen, 
  GraduationCap,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useResourceStore } from '../../store/resourceStore';
import { useCourseStore } from '../../store/courseStore';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { resources } = useResourceStore();
  const { courses } = useCourseStore();
  const [timeRange, setTimeRange] = useState('month');
  
  if (!hasPermission(['ADMIN', 'SUPER_ADMIN'])) {
    return (
      <div className="text-center py-12">
        <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Access Denied</h3>
        <p className="text-gray-500">You don't have permission to view this page</p>
      </div>
    );
  }
  
  // Mock analytics data
  const analyticsData = {
    totalUsers: 850,
    totalResources: resources.length,
    totalCourses: courses.length,
    resourcesAccessed: 3245,
    activeUsers: 412,
    userGrowth: 8.5,
    resourceGrowth: 12.3,
    courseGrowth: 5.2,
    
    // User activity over time
    userActivity: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Active Users',
          data: [320, 350, 380, 410, 390, 405, 425, 430, 450, 470, 490, 510],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    
    // Resource usage by type
    resourceUsage: {
      labels: ['PDF', 'Video', 'Audio', 'EPUB', 'HTML'],
      datasets: [
        {
          label: 'Resource Usage',
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            'rgba(79, 70, 229, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(248, 113, 113, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    },
    
    // Course enrollment by category
    courseEnrollment: {
      labels: ['Computer Science', 'Economics', 'Art History', 'Physics', 'Chemistry', 'Mathematics'],
      datasets: [
        {
          label: 'Enrollments',
          data: [120, 85, 65, 95, 75, 90],
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
        }
      ]
    },
    
    // Popular resources
    popularResources: resources
      .sort((a, b) => b.bookmarks - a.bookmarks)
      .slice(0, 5)
  };
  
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-indigo-100">Comprehensive insights into platform usage and performance</p>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === 'week' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === 'month' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            This Month
          </button>
          <button 
            onClick={() => setTimeRange('quarter')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === 'quarter' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            This Quarter
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === 'year' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            This Year
          </button>
          <button 
            onClick={() => setTimeRange('custom')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              timeRange === 'custom' 
                ? 'bg-white text-indigo-700 shadow-md' 
                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Custom Range
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{analyticsData.totalUsers}</p>
            <p className={`text-xs flex items-center mt-1 ${
              analyticsData.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.userGrowth >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(analyticsData.userGrowth)}% {analyticsData.userGrowth >= 0 ? 'increase' : 'decrease'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Resources</p>
            <p className="text-2xl font-bold">{analyticsData.totalResources}</p>
            <p className={`text-xs flex items-center mt-1 ${
              analyticsData.resourceGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.resourceGrowth >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(analyticsData.resourceGrowth)}% {analyticsData.resourceGrowth >= 0 ? 'increase' : 'decrease'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <GraduationCap className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-2xl font-bold">{analyticsData.totalCourses}</p>
            <p className={`text-xs flex items-center mt-1 ${
              analyticsData.courseGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.courseGrowth >= 0 ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(analyticsData.courseGrowth)}% {analyticsData.courseGrowth >= 0 ? 'increase' : 'decrease'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold">{analyticsData.activeUsers}</p>
            <p className="text-xs text-gray-500 mt-1">
              Last 24 hours
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2 text-indigo-600" size={18} />
              User Activity
            </h2>
          </div>
          <div className="p-6">
            <Line 
              data={analyticsData.userActivity}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="mr-2 text-blue-600" size={18} />
              Resource Usage by Type
            </h2>
          </div>
          <div className="p-6">
            <Doughnut 
              data={analyticsData.resourceUsage}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GraduationCap className="mr-2 text-purple-600" size={18} />
              Course Enrollment by Category
            </h2>
          </div>
          <div className="p-6">
            <Bar 
              data={analyticsData.courseEnrollment}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 text-green-600" size={18} />
              Popular Resources
            </h2>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {analyticsData.popularResources.map((resource) => (
                <li key={resource.id} className="py-3 flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                    <img
                      src={resource.thumbnailUrl}
                      alt={resource.title}
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {resource.bookmarks} bookmarks
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a href="/resources" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                View all resources <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart2 className="mr-2 text-indigo-600" size={18} />
              Detailed Analytics
            </h2>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    User Registrations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    38
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +18.4%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Resource Uploads
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    28
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    32
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -12.5%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Course Enrollments
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    124
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    98
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +26.5%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Average Session Duration
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    18:45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    15:20
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +22.3%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Resource Downloads
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    356
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    289
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +23.2%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;