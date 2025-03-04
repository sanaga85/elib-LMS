import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Download, 
  Trash2, 
  Settings, 
  RefreshCw,
  WifiOff,
  Database,
  Save
} from 'lucide-react';
import { getOfflineStorageStats, clearAllOfflineResources } from '../../services/offline';
import OfflineResourceManager from '../../components/offline/OfflineResourceManager';

const OfflineSettings: React.FC = () => {
  const [maxStorageSize, setMaxStorageSize] = useState(500);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false);
  const [downloadOnWifiOnly, setDownloadOnWifiOnly] = useState(true);
  const [autoCleanupEnabled, setAutoCleanupEnabled] = useState(false);
  const [autoCleanupDays, setAutoCleanupDays] = useState(30);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      const settings = localStorage.getItem('offlineSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setMaxStorageSize(parsedSettings.maxStorageSize || 500);
        setAutoDownloadEnabled(parsedSettings.autoDownloadEnabled || false);
        setDownloadOnWifiOnly(parsedSettings.downloadOnWifiOnly || true);
        setAutoCleanupEnabled(parsedSettings.autoCleanupEnabled || false);
        setAutoCleanupDays(parsedSettings.autoCleanupDays || 30);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    
    // Save settings to localStorage
    const settings = {
      maxStorageSize,
      autoDownloadEnabled,
      downloadOnWifiOnly,
      autoCleanupEnabled,
      autoCleanupDays
    };
    
    localStorage.setItem('offlineSettings', JSON.stringify(settings));
    
    // Update metadata in IndexedDB
    getOfflineStorageStats().then(stats => {
      const metadata = {
        ...stats,
        maxStorageSize: maxStorageSize * 1024 * 1024 // Convert MB to bytes
      };
      
      // In a real implementation, we would update the metadata in IndexedDB here
      console.log('Updated metadata:', metadata);
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }).catch(error => {
      console.error('Error updating metadata:', error);
      setIsSaving(false);
      setSaveSuccess(false);
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Offline Settings</h1>
        <p className="text-gray-600">Configure how the application behaves when you're offline</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Settings className="mr-2 text-indigo-600" size={20} />
              Offline Configuration
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="maxStorageSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Storage Size (MB)
                </label>
                <input
                  type="number"
                  id="maxStorageSize"
                  value={maxStorageSize}
                  onChange={(e) => setMaxStorageSize(parseInt(e.target.value) || 500)}
                  min="100"
                  max="2000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: 500MB. Maximum: 2000MB (2GB)
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  id="autoDownloadEnabled"
                  name="autoDownloadEnabled"
                  type="checkbox"
                  checked={autoDownloadEnabled}
                  onChange={(e) => setAutoDownloadEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="autoDownloadEnabled" className="ml-2 block text-sm text-gray-900">
                  Auto-download recently viewed resources
                </label>
              </div>
              
              {autoDownloadEnabled && (
                <div className="ml-6">
                  <div className="flex items-center">
                    <input
                      id="downloadOnWifiOnly"
                      name="downloadOnWifiOnly"
                      type="checkbox"
                      checked={downloadOnWifiOnly}
                      onChange={(e) => setDownloadOnWifiOnly(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="downloadOnWifiOnly" className="ml-2 block text-sm text-gray-900">
                      Download on Wi-Fi only
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended to avoid excessive mobile data usage
                  </p>
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  id="autoCleanupEnabled"
                  name="autoCleanupEnabled"
                  type="checkbox"
                  checked={autoCleanupEnabled}
                  onChange={(e) => setAutoCleanupEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="autoCleanupEnabled" className="ml-2 block text-sm text-gray-900">
                  Auto-cleanup unused resources
                </label>
              </div>
              
              {autoCleanupEnabled && (
                <div className="ml-6">
                  <label htmlFor="autoCleanupDays" className="block text-sm font-medium text-gray-700 mb-1">
                    Remove resources not accessed in
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="autoCleanupDays"
                      value={autoCleanupDays}
                      onChange={(e) => setAutoCleanupDays(parseInt(e.target.value) || 30)}
                      min="1"
                      max="365"
                      className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <span className="ml-2 text-sm text-gray-700">days</span>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
                
                {saveSuccess !== null && (
                  <p className={`mt-2 text-sm text-center ${saveSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {saveSuccess ? 'Settings saved successfully' : 'Failed to save settings'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <WifiOff className="mr-2 text-indigo-600" size={20} />
              Offline Mode
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              When you're offline, you can still access downloaded resources and continue your learning journey.
            </p>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">Available Offline:</h3>
              <ul className="text-sm text-indigo-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>View downloaded resources (PDFs, videos, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Access your bookmarks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>View your progress and achievements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <OfflineResourceManager />
        </div>
      </div>
    </div>
  );
};

export default OfflineSettings;