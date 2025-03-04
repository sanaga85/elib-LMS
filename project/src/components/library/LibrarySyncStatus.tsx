import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Info,
  Calendar,
  Download
} from 'lucide-react';
import localforage from 'localforage';

interface SyncStatus {
  lastSyncTime: string | null;
  resourcesAdded: number;
  lastSyncRun: string | null;
  isRunning: boolean;
  error: string | null;
}

const LibrarySyncStatus: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncTime: null,
    resourcesAdded: 0,
    lastSyncRun: null,
    isRunning: false,
    error: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first
      const syncLogJson = localStorage.getItem('library-sync-status');
      if (syncLogJson) {
        const syncLog = JSON.parse(syncLogJson);
        setSyncStatus({
          lastSyncTime: syncLog.lastSyncTime,
          resourcesAdded: syncLog.resourcesAdded || 0,
          lastSyncRun: syncLog.lastSyncRun,
          isRunning: false,
          error: null
        });
      } else {
        // Try to load from localforage as fallback
        const syncLog = await localforage.getItem<any>('library-sync-status');
        if (syncLog) {
          setSyncStatus({
            lastSyncTime: syncLog.lastSyncTime,
            resourcesAdded: syncLog.resourcesAdded || 0,
            lastSyncRun: syncLog.lastSyncRun,
            isRunning: false,
            error: null
          });
        }
      }
    } catch (error) {
      console.error('Error loading sync status:', error);
      setSyncStatus(prev => ({
        ...prev,
        error: 'Failed to load sync status'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getNextSyncTime = () => {
    if (!syncStatus.lastSyncRun) return 'Unknown';
    
    try {
      const syncInterval = parseInt(import.meta.env.VITE_SYNC_INTERVAL || '86400000');
      const lastRun = new Date(syncStatus.lastSyncRun).getTime();
      const nextRun = new Date(lastRun + syncInterval);
      return nextRun.toLocaleString();
    } catch (e) {
      return 'Unknown';
    }
  };

  const handleManualSync = () => {
    // In a real implementation, this would trigger a manual sync
    alert('Manual sync would be triggered here. In a production environment, this would connect to the backend to start a sync process.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <RefreshCw className="mr-2 text-indigo-600" size={20} />
          Library Sync Status
        </h2>
        <button
          onClick={handleManualSync}
          disabled={isLoading || syncStatus.isRunning}
          className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading || syncStatus.isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Download className="h-4 w-4 mr-1" />
          Sync Now
        </button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading sync status...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-indigo-700">
                      The library sync process automatically fetches new resources from external libraries.
                      This helps keep your library up-to-date with the latest available content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Last Sync</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {formatDate(syncStatus.lastSyncRun)}
                </p>
                {syncStatus.lastSyncRun && (
                  <p className="text-xs text-gray-500 mt-1">
                    Next scheduled: {getNextSyncTime()}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Resources Added</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {syncStatus.resourcesAdded}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Since {formatDate(syncStatus.lastSyncTime)}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Sync Frequency</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {parseInt(import.meta.env.VITE_SYNC_INTERVAL || '86400000') / (1000 * 60 * 60)} hours
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Configurable in environment settings
                </p>
              </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-900">Sync Details</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {showDetails && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Sync Configuration</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500">Sync Interval</span>
                        <p className="text-sm font-medium">{parseInt(import.meta.env.VITE_SYNC_INTERVAL || '86400000') / (1000 * 60 * 60)} hours</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500">Max Resources Per Sync</span>
                        <p className="text-sm font-medium">500</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500">Sync Script</span>
                        <p className="text-sm font-medium">scripts/syncLibraries.js</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500">Sync Status</span>
                        <p className="text-sm font-medium flex items-center">
                          {syncStatus.isRunning ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 text-yellow-500 animate-spin" />
                              Running
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              Idle
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Connected Libraries</h4>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        National Digital Library of India
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Open Library
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Project Gutenberg
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Google Books
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Internet Archive
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Europeana
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        HathiTrust Digital Library
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        Directory of Open Access Books
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {syncStatus.error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{syncStatus.error}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibrarySyncStatus;