import React, { useState } from 'react';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInstitutionStore } from '../../store/institutionStore';
import { Link, useNavigate } from 'react-router-dom';

const InstitutionsList: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { institutions, toggleInstitutionStatus, deleteInstitution } = useInstitutionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
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
  
  // Filter institutions based on search query and active status
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          institution.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = showInactive ? true : institution.active;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddInstitution = () => {
    navigate('/institutions/register');
  };

  const handleToggleStatus = (id: string) => {
    toggleInstitutionStatus(id);
  };

  const handleDeleteInstitution = (id: string) => {
    if (window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
      deleteInstitution(id);
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutions</h1>
          <p className="text-gray-600">Manage all institutions on the platform</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddInstitution}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="relative flex-1 mb-4 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search institutions by name or domain"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="show-inactive"
                name="show-inactive"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              <label htmlFor="show-inactive" className="ml-2 block text-sm text-gray-900">
                Show inactive institutions
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map((institution) => (
              <li key={institution.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                        <img
                          src={institution.logo}
                          alt={institution.name}
                          className="h-12 w-12 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{institution.name}</h3>
                          {institution.active ? (
                            <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="mr-4">Domain: {institution.domain}</span>
                          <span>Added: {new Date(institution.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/institutions/${institution.id}/edit`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(institution.id)}
                        className={`inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium ${
                          institution.active
                            ? 'text-red-700 bg-white hover:bg-red-50'
                            : 'text-green-700 bg-white hover:bg-green-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {institution.active ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteInstitution(institution.id)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div 
                        className="h-4 w-4 rounded-full mr-2"
                        style={{ backgroundColor: institution.primaryColor }}
                      ></div>
                      <span className="text-xs text-gray-500">Primary Color</span>
                      <div 
                        className="h-4 w-4 rounded-full mx-2"
                        style={{ backgroundColor: institution.secondaryColor }}
                      ></div>
                      <span className="text-xs text-gray-500">Secondary Color</span>
                    </div>
                    <div className="mt-2 sm:mt-0 flex space-x-2">
                      <Link
                        to={`/institutions/${institution.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                      >
                        View Details <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Link
                        to={`/institutions/${institution.id}/users`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Manage Users
                      </Link>
                      <Link
                        to={`/institutions/${institution.id}/resources`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Manage Resources
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-12 text-center">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No institutions found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Search
                </button>
              )}
            </li>
          )}
        </ul>
      </div>
      
      {institutions.length === 0 && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No institutions have been added yet. Click the "Add Institution" button to create your first institution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionsList;