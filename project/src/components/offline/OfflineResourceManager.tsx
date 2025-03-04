import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  HardDrive, 
  Clock, 
  FileText, 
  Video, 
  Headphones, 
  AlertCircle,
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  getOfflineResources, 
  getOfflineStorageStats, 
  removeOfflineResource, 
  clearAllOfflineResources 
} from '../../services/offline';

const OfflineResourceManager: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    totalItems: number;
    totalStorageUsed: number;
    maxStorageSize: number;
    lastSyncTime: string | null;
  }>({
    totalItems: 0,
    totalStorageUsed: 0,
    maxStorageSize: 0,
    lastSyncTime: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    isDeleting: boolean;
    success: boolean | null;
    message: string;
  }>({
    isDeleting: false,
    success: null,
    message: ''
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const offlineResources = await getOfflineResources();
      const storageStats = await getOfflineStorageStats();
      
      setResources(offlineResources);
      setStats(storageStats);
    } catch (error) {
      console.error('Error loading offline resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteResource = (resourceId: string) => {
    setResourceToDelete(resourceId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return;
    
    setDeleteStatus({
      isDeleting: true,
      success: null,
      message: 'Deleting resource...'
    });
    
    try {
      const success = await removeOfflineResource(resourceToDelete);
      
      if (success) {
        setDeleteStatus({
          isDeleting: false,
          success: true,
          message: 'Resource deleted successfully'
        });
        
        // Refresh resources
        loadResources();
      } else {
        setDeleteStatus({
          isDeleting: false,
          success: false,
          message: 'Failed to delete resource'
        });
      }
    } catch (error) {
      setDeleteStatus({
        isDeleting: false,
        success: false,
        message: 'An error occurred while deleting the resource'
      });
    }
    
    // Close confirmation dialog
    setShowDeleteConfirm(false);
    setResourceToDelete(null);
    
    // Clear status after a delay
    setTimeout(() => {
      setDeleteStatus({
        isDeleting: false,
        success: null,
        message: ''
      });
    }, 3000);
  };

  const handleClearAll = () => {
    setShowClearAllConfirm(true);
  };

  const confirmClearAll = async () => {
    setDeleteStatus({
      isDeleting: true,
      success: null,
      message: 'Clearing all offline resources...'
    });
    
    try {
      const success = await clearAllOfflineResources();
      
      if (success) {
        setDeleteStatus({
          isDeleting: false,
          success: true,
          message: 'All offline resources cleared successfully'
        });
        
        // Refresh resources
        loadResources();
      } else {
        setDeleteStatus({
          isDeleting: false,
          success: false,
          message: 'Failed to clear offline resources'
        });
      }
    } catch (error) {
      console.error("Error clearing offline resources:", error);
      setDeleteStatus({
        isDeleting: false,
        success: false,
        message: 'An error occurred while clearing resources'
      });
    }
    
    // Close confirmation dialog
    setShowClearAllConfirm(false);
    
    // Clear status after a delay
    setTimeout(() => {
      setDeleteStatus({
        isDeleting: false,
        success: null,
        message: ''
      });
    }, 3000);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'VIDEO':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'AUDIO':
        return <Headphones className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <HardDrive className="mr-2 text-indigo-600" size={20} />
          Offline Resources
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={loadResources}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <button
            onClick={handleClearAll}
            disabled={resources.length === 0}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              resources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {deleteStatus.message && (
          <div className={`mb-4 p-3 rounded-md ${
            deleteStatus.success === null
              ? 'bg-blue-50 text-blue-800 border border-blue-100'
              : deleteStatus.success
                ? 'bg-green-50 text-green-800 border border-green-100'
                : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
            <div className="flex items-center">
              {deleteStatus.success === null ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : deleteStatus.success ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {deleteStatus.message}
            </div>
          </div>
        )}
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4 flex flex-col">
            <div className="text-sm text-indigo-800 font-medium mb-1">Total Resources</div>
            <div className="text-2xl font-bold text-indigo-900">{stats.totalItems}</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 flex flex-col">
            <div className="text-sm text-indigo-800 font-medium mb-1">Storage Used</div>
            <div className="text-2xl font-bold text-indigo-900">{formatBytes(stats.totalStorageUsed)}</div>
            <div className="text-xs text-indigo-700 mt-1">
              of {formatBytes(stats.maxStorageSize)}
              ({Math.round((stats.totalStorageUsed / stats.maxStorageSize) * 100)}%)
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (stats.totalStorageUsed / stats.maxStorageSize) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 flex flex-col">
            <div className="text-sm text-indigo-800 font-medium mb-1">Last Sync</div>
            <div className="text-lg font-bold text-indigo-900">
              {stats.lastSyncTime ? formatDate(stats.lastSyncTime) : 'Never'}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading offline resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloaded
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getResourceIcon(resource.type)}
                        <span className="ml-1 text-sm text-gray-500">{resource.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBytes(resource.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(resource.downloadedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <HardDrive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offline resources</h3>
            <p className="text-gray-500 mb-6">You haven't downloaded any resources for offline use yet.</p>
            <a
              href="/library"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Browse Library
            </a>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Remove Offline Resource
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this resource from offline storage? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteResource}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setResourceToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Clear All Offline Resources
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove all resources from offline storage? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmClearAll}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineResourceManager;