import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  School, 
  Users, 
  BookOpen, 
  Settings, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInstitutionStore } from '../../store/institutionStore';

const InstitutionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuthStore();
  const { getInstitution, toggleInstitutionStatus, deleteInstitution } = useInstitutionStore();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  if (!hasPermission(['SUPER_ADMIN'])) {
    return (
      <div className="text-center py-12">
        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Access Denied</h3>
        <p className="text-gray-500">You don't have permission to view this page</p>
      </div>
    );
  }
  
  const institution = id ? getInstitution(id) : undefined;
  
  if (!institution) {
    return (
      <div className="text-center py-12">
        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Institution Not Found</h3>
        <p className="text-gray-500 mb-4">The institution you're looking for doesn't exist or has been removed</p>
        <Link
          to="/institutions"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Institutions
        </Link>
      </div>
    );
  }
  
  // Mock statistics
  const mockStats = {
    users: 1250,
    resources: 3500,
    courses: 85,
    activeUsers: 750,
    resourcesAccessed: 12500,
    averageSessionTime: '45 minutes'
  };
  
  const handleToggleStatus = () => {
    toggleInstitutionStatus(institution.id);
  };
  
  const handleDeleteInstitution = () => {
    if (window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
      deleteInstitution(institution.id);
      navigate('/institutions');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/institutions"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Institutions
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-start">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
              <img
                src={institution.logo}
                alt={institution.name}
                className="h-16 w-16 object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{institution.name}</h1>
              <div className="flex items-center mt-1">
                <Globe className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{institution.domain}</span>
                {institution.active ? (
                  <span className="ml-2 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="ml-2 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/institutions/${institution.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                institution.active
                  ? 'text-red-700 bg-white hover:bg-red-50'
                  : 'text-green-700 bg-white hover:bg-green-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {institution.active ? (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </button>
            <button
              onClick={handleDeleteInstitution}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'resources'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                  <div className="rounded-full bg-indigo-100 p-3 mr-4">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{mockStats.users}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Resources</p>
                    <p className="text-2xl font-bold">{mockStats.resources}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <BarChart2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">{mockStats.activeUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Institution Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Globe className="h-4 w-4 mr-1 text-gray-400" />
                          Domain
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{institution.domain}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          Created
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(institution.createdAt).toLocaleDateString()}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{institution.email || `contact@${institution.domain}`}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{institution.phone || 'Not provided'}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{institution.address || 'Not provided'}</dd>
                      </div>
                      {institution.description && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Description</dt>
                          <dd className="mt-1 text-sm text-gray-900">{institution.description}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Branding</h3>
                    <div className="flex space-x-4 mb-4">
                      <div>
                        <div 
                          className="h-12 w-12 rounded-md"
                          style={{ backgroundColor: institution.primaryColor }}
                        ></div>
                        <p className="text-xs text-gray-500 mt-1">Primary</p>
                        <p className="text-xs font-mono">{institution.primaryColor}</p>
                      </div>
                      <div>
                        <div 
                          className="h-12 w-12 rounded-md"
                          style={{ backgroundColor: institution.secondaryColor }}
                        ></div>
                        <p className="text-xs text-gray-500 mt-1">Secondary</p>
                        <p className="text-xs font-mono">{institution.secondaryColor}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Preview</h3>
                    <div 
                      className="p-4 rounded-md"
                      style={{ backgroundColor: `${institution.primaryColor}20` }}
                    >
                      <h4 
                        className="text-lg font-medium mb-2"
                        style={{ color: institution.primaryColor }}
                      >
                        {institution.name}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        This is a sample text to preview how the institution's branding colors look in the application.
                      </p>
                      <div className="mt-3">
                        <button 
                          className="px-3 py-1 rounded-md text-white text-sm"
                          style={{ backgroundColor: institution.primaryColor }}
                        >
                          Primary Button
                        </button>
                        <button 
                          className="px-3 py-1 rounded-md text-white text-sm ml-2"
                          style={{ backgroundColor: institution.secondaryColor }}
                        >
                          Secondary Button
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to={`/institutions/${institution.id}/users`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                  <Link
                    to={`/institutions/${institution.id}/resources`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Resources
                  </Link>
                  <Link
                    to={`/institutions/${institution.id}/settings`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Users</h2>
                <Link
                  to={`/institutions/${institution.id}/users/add`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add User
                </Link>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Showing 5 of {mockStats.users} users</div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Filter
                      </button>
                      <button className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-indigo-800">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][index]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {['john.doe', 'jane.smith', 'robert.johnson', 'emily.davis', 'michael.wilson'][index]}@{institution.domain}
                          </div>
                        </td>
                        <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-500">
                            {['Admin', 'Teacher', 'Teacher', 'Student', 'Student'][index]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        </tr>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetails;