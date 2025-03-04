import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  BarChart2, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Globe,
  Database
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { libraryApiManager } from '../../services/externalLibraries';
import { libraryMiddleware } from '../../services/libraryMiddleware';

interface APIConfig {
  name: string;
  enabled: boolean;
  apiKey: string;
  usageLimit: number;
  rateLimitPerMinute: number;
  lastSyncTime: string | null;
  errorCount: number;
  responseTime: number;
  totalRequests: number;
  institutions: string[];
}

const APIManagement: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<{ keys: string[], size: number } | null>(null);
  
  useEffect(() => {
    loadConfigurations();
    loadCacheStats();
  }, []);
  
  if (!hasPermission(['SUPER_ADMIN'])) {
    return (
      <div className="text-center py-12">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Access Denied</h3>
        <p className="text-gray-500">You don't have permission to view this page</p>
      </div>
    );
  }
  
  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would load from the database
      // For now, we'll use environment variables and mock data
      setConfigs([
        {
          name: 'Google Books',
          enabled: true,
          apiKey: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '',
          usageLimit: 1000,
          rateLimitPerMinute: 60,
          lastSyncTime: new Date().toISOString(),
          errorCount: 0,
          responseTime: 245,
          totalRequests: 156,
          institutions: ['1', '2']
        },
        {
          name: 'Europeana',
          enabled: true,
          apiKey: import.meta.env.VITE_EUROPEANA_API_KEY || '',
          usageLimit: 1000,
          rateLimitPerMinute: 30,
          lastSyncTime: new Date().toISOString(),
          errorCount: 2,
          responseTime: 312,
          totalRequests: 89,
          institutions: ['1']
        },
        {
          name: 'HathiTrust',
          enabled: false,
          apiKey: import.meta.env.VITE_HATHITRUST_API_KEY || '',
          usageLimit: 500,
          rateLimitPerMinute: 30,
          lastSyncTime: null,
          errorCount: 5,
          responseTime: 456,
          totalRequests: 45,
          institutions: []
        }
      ]);
    } catch (error) {
      console.error('Error loading API configurations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCacheStats = async () => {
    try {
      const stats = await libraryMiddleware.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };
  
  const toggleProviderStatus = async (name: string) => {
    setConfigs(prev => prev.map(config => 
      config.name === name 
        ? { ...config, enabled: !config.enabled }
        : config
    ));
  };
  
  const updateApiKey = async (name: string, newKey: string) => {
    setConfigs(prev => prev.map(config => 
      config.name === name 
        ? { ...config, apiKey: newKey }
        : config
    ));
  };
  
  const clearCache = async () => {
    try {
      await libraryMiddleware.clearCache();
      await loadCacheStats();
      alert('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    }
  };
  
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
        <p className="text-gray-600">Configure and monitor external library API integrations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">API Status</h2>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {configs.filter(c => c.enabled).length}/{configs.length}
          </div>
          <p className="text-sm text-gray-600">APIs enabled</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Total Requests</h2>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {configs.reduce((sum, config) => sum + config.totalRequests, 0)}
          </div>
          <p className="text-sm text-gray-600">API calls made</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Cache Size</h2>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {cacheStats ? formatBytes(cacheStats.size) : '0 B'}
          </div>
          <p className="text-sm text-gray-600">
            {cacheStats ? `${cacheStats.keys.length} items cached` : 'No items cached'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="mr-2 text-indigo-600" size={20} />
            API Configurations
          </h2>
          <button
            onClick={clearCache}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Clear Cache
          </button>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-indigo-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading API configurations...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {configs.map((config) => (
                <div 
                  key={config.name}
                  className="border rounded-lg overflow-hidden hover:border-indigo-200 transition-colors"
                >
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="text-md font-medium text-gray-900">{config.name}</h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        config.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleProviderStatus(config.name)}
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          config.enabled
                            ? 'text-red-700 hover:bg-red-50'
                            : 'text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {config.enabled ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="flex items-center">
                          <input
                            type={showApiKeys[config.name] ? 'text' : 'password'}
                            value={config.apiKey}
                            onChange={(e) => updateApiKey(config.name, e.target.value)}
                            className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => setShowApiKeys(prev => ({
                              ...prev,
                              [config.name]: !prev[config.name]
                            }))}
                            className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiKeys[config.name] ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate Limit
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={config.rateLimitPerMinute}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                setConfigs(prev => prev.map(c => 
                                  c.name === config.name 
                                    ? { ...c, rateLimitPerMinute: value }
                                    : c
                                ));
                              }
                            }}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <span className="ml-2 text-sm text-gray-500">per minute</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Requests</p>
                        <p className="text-sm font-medium">{config.totalRequests}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Error Count</p>
                        <p className="text-sm font-medium">{config.errorCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Response Time</p>
                        <p className="text-sm font-medium">{config.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Sync</p>
                        <p className="text-sm font-medium">{formatDate(config.lastSyncTime)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Enabled for Institutions</p>
                      <div className="flex flex-wrap gap-2">
                        {config.institutions.length > 0 ? (
                          config.institutions.map((id) => (
                            <span 
                              key={id}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              Institution {id}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No institutions enabled</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Key className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Security Best Practices</h3>
            <p className="text-gray-600 mb-4">
              Keep your API keys secure and regularly rotate them. Monitor API usage and set up alerts for unusual activity.
              Make sure to implement proper rate limiting and error handling.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Documentation
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-xs font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Security Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManagement;