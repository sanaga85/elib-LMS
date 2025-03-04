import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Filter, 
  Globe, 
  Download, 
  ExternalLink,
  Bookmark,
  RefreshCw,
  AlertCircle,
  Info,
  BookMarked,
  FileText,
  Video,
  Headphones
} from 'lucide-react';
import { libraryApiManager, ExternalLibraryResource } from '../../services/externalLibraries';
import DownloadResourceButton from '../offline/DownloadResourceButton';
import { resourceAPI } from '../../services/api';

interface ExternalLibrarySearchProps {
  onImportResource?: (resource: ExternalLibraryResource) => void;
}

const ExternalLibrarySearch: React.FC<ExternalLibrarySearchProps> = ({ onImportResource }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<ExternalLibraryResource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ExternalLibraryResource | null>(null);
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  const [importingResource, setImportingResource] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeProviders = async () => {
      setIsInitializing(true);
      try {
        await libraryApiManager.initialize();
        const providers = libraryApiManager.getAvailableProviders();
        setAvailableProviders(providers.map(p => p.name));
      } catch (error) {
        console.error('Error initializing library providers:', error);
        setError('Failed to initialize library providers. Please try again later.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeProviders();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setError(null);
    setPage(1);
    setSearchResults([]);
    setCategories([]);
    setResourceTypes([]);

    try {
      let results: ExternalLibraryResource[];

      if (selectedProvider === 'all') {
        results = await libraryApiManager.searchAllProviders(searchQuery, { page: 1, size: 20 });
      } else {
        results = await libraryApiManager.searchProvider(selectedProvider, searchQuery, { page: 1, size: 20 });
      }

      setSearchResults(results);
      setHasMore(results.length === 20);
      setTotalResults(results.length);

      // Extract unique categories and resource types
      const uniqueCategories = new Set<string>();
      const uniqueTypes = new Set<string>();

      results.forEach(resource => {
        resource.categories.forEach(category => uniqueCategories.add(category));
        uniqueTypes.add(resource.type);
      });

      setCategories(Array.from(uniqueCategories));
      setResourceTypes(Array.from(uniqueTypes));
    } catch (error) {
      console.error('Error searching external libraries:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (isSearching || !hasMore) {
      return;
    }

    setIsSearching(true);
    const nextPage = page + 1;

    try {
      let results: ExternalLibraryResource[];

      if (selectedProvider === 'all') {
        results = await libraryApiManager.searchAllProviders(searchQuery, { page: nextPage, size: 20 });
      } else {
        results = await libraryApiManager.searchProvider(selectedProvider, searchQuery, { page: nextPage, size: 20 });
      }

      setSearchResults(prev => [...prev, ...results]);
      setPage(nextPage);
      setHasMore(results.length === 20);
      setTotalResults(prev => prev + results.length);
    } catch (error) {
      console.error('Error loading more results:', error);
      setError('An error occurred while loading more results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewDetails = (resource: ExternalLibraryResource) => {
    setSelectedResource(resource);
    setShowResourceDetails(true);
  };

  const handleCloseDetails = () => {
    setShowResourceDetails(false);
    setSelectedResource(null);
  };

  const handleImportResource = async (resource: ExternalLibraryResource) => {
    if (importingResource) {
      return;
    }

    setImportingResource(true);

    try {
      // Convert external resource to internal resource format
      const internalResource = libraryApiManager.convertToInternalResource(resource);
      
      // Save to database via API
      await resourceAPI.createResource(internalResource);
      
      if (onImportResource) {
        onImportResource(resource);
      }
      
      // Close details modal
      handleCloseDetails();
      
      // Show success message
      alert(`Resource "${resource.title}" has been imported successfully.`);
    } catch (error) {
      console.error('Error importing resource:', error);
      alert('An error occurred while importing the resource. Please try again.');
    } finally {
      setImportingResource(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
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
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter results based on selected category and type
  const filteredResults = searchResults.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.categories.includes(selectedCategory);
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesCategory && matchesType;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="mr-2 text-indigo-600" size={20} />
          External Library Search
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Search for resources from national and international open-source libraries
        </p>
      </div>

      <div className="p-6">
        {isInitializing ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Initializing library connections...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Query
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="searchQuery"
                      placeholder="Search for books, articles, videos..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                    Library Source
                  </label>
                  <select
                    id="provider"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="all">All Available Libraries</option>
                    {availableProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSearching || !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </> ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2 md:mb-0">
                    {filteredResults.length} results found
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div>
                      <label htmlFor="category" className="block text-xs font-medium text-gray-500 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-xs font-medium text-gray-500 mb-1">
                        Resource Type
                      </label>
                      <select
                        id="type"
                        className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        {resourceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Searching across {selectedProvider === 'all' ? availableProviders.length : 1} libraries. 
                        Click "View Details" to see more information or "Import" to add to your library.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-40 bg-gray-200 relative">
                        {resource.thumbnailUrl ? (
                          <img
                            src={resource.thumbnailUrl}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {resource.source}
                        </div>
                        {resource.license && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            {resource.license.includes('http') ? 'Licensed' : resource.license}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <span className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {getResourceIcon(resource.type)}
                            <span className="ml-1">{resource.type}</span>
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(resource.publishedDate)}
                          </span>
                        </div>

                        <h3 className="text-md font-medium text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                        <p className="text-xs text-gray-500 mb-3">By {resource.author}</p>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleViewDetails(resource)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            View Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </button>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleImportResource(resource)}
                              className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                              title="Import to library"
                            >
                              <BookMarked className="h-4 w-4" />
                            </button>
                            {resource.downloadUrl && (
                              <a
                                href={resource.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                title="Download resource"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isSearching}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isSearching ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Results'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search query or selecting a different library source.
                </p>
              </div>
            )}

            {!searchQuery && !isSearching && (
              <div className="text-center py-12">
                <Globe className="mx-auto h-12 w-12 text-indigo-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Search External Libraries</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a search term to find resources from {availableProviders.length} open-source libraries.
                </p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
                  {availableProviders.map((provider) => (
                    <div key={provider} className="bg-indigo-50 rounded-lg p-2 text-xs text-indigo-700">
                      {provider}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Resource Details Modal */}
      {showResourceDetails && selectedResource && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedResource.title}
                    </h3>
                    <div className="mt-2">
                      <div className="flex items-center mb-2">
                        <span className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                          {getResourceIcon(selectedResource.type)}
                          <span className="ml-1">{selectedResource.type}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(selectedResource.publishedDate)}
                        </span>
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {selectedResource.source}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4">{selectedResource.description}</p>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Author</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedResource.author}</dd>
                          </div>
                          {selectedResource.publisher && (
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedResource.publisher}</dd>
                            </div>
                          )}
                          {selectedResource.language && (
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Language</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedResource.language}</dd>
                            </div>
                          )}
                          {selectedResource.isbn && (
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedResource.isbn}</dd>
                            </div>
                          )}
                          {selectedResource.license && (
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">License</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedResource.license}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                      
                      {selectedResource.categories.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                          <div className="flex flex-wrap mt-1">
                            {selectedResource.categories.map((category, index) => (
                              <span key={index} className="mr-2 mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleImportResource(selectedResource)}
                  disabled={importingResource}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    importingResource ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {importingResource ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <BookMarked className="h-4 w-4 mr-2" />
                      Import to Library
                    </>
                  )}
                </button>
                {selectedResource.downloadUrl && (
                  <a
                    href={selectedResource.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalLibrarySearch;