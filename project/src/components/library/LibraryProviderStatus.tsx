import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Info
} from 'lucide-react';
import { libraryApiManager } from '../../services/externalLibraries';

interface ProviderStatus {
  name: string;
  isAvailable: boolean;
  isChecking: boolean;
  error?: string;
}

const LibraryProviderStatus: React.FC = () => {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkProviders();
  }, []);

  const checkProviders = async () => {
    setIsInitializing(true);
    
    try {
      await libraryApiManager.initialize();
      const availableProviders = libraryApiManager.getAvailableProviders();
      
      // Create status objects for all providers
      const allProviders = [
        'National Digital Library of India',
        'Open Library',
        'Project Gutenberg',
        'Google Books',
        'Internet Archive',
        'Europeana',
        'HathiTrust Digital Library',
        'World Digital Library',
        'Directory of Open Access Books'
      ];
      
      const providerStatuses = allProviders.map(name => {
        const isAvailable = availableProviders.some(p => p.name === name);
        return {
          name,
          isAvailable,
          isChecking: false
        };
      });
      
      setProviders(providerStatuses);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking providers:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRefresh = () => {
    checkProviders();
  };

  const availableCount = providers.filter(p => p.isAvailable).length;
  const totalCount = providers.length;
  const availabilityPercentage = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="mr-2 text-indigo-600" size={20} />
          Library Providers Status
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isInitializing}
          className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isInitializing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isInitializing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="p-6">
        {isInitializing ? (
          <div className="text-center py-8">
            <RefreshCw className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Checking library providers...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900 mr-2">Provider Availability</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    availabilityPercentage > 80 ? 'bg-green-100 text-green-800' :
                    availabilityPercentage > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {availabilityPercentage}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {availableCount} of {totalCount} library providers are currently available
                </p>
                {lastChecked && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last checked: {lastChecked.toLocaleString()}
                  </p>
                )}
              </div>
              
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Library providers are external services that may experience downtime or rate limiting.
                    If a provider is unavailable, you can still search other available libraries.
                  </p>
                </div>
              </div>
            </div>
            
            {showDetails && (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {providers.map((provider) => (
                      <tr key={provider.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {provider.isAvailable ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-sm text-green-800">Available</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-sm text-red-800">Unavailable</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryProviderStatus;