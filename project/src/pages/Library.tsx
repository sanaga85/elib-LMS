import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Headphones, 
  BookMarked,
  Filter,
  Search,
  Heart,
  Share2,
  Download,
  Star,
  Bookmark,
  Sparkles,
  TrendingUp,
  HardDrive,
  WifiOff,
  Globe,
  RefreshCw
} from 'lucide-react';
import DownloadResourceButton from '../components/offline/DownloadResourceButton';
import { isResourceAvailableOffline } from '../services/offline';
import ExternalLibrarySearch from '../components/library/ExternalLibrarySearch';
import LibraryProviderStatus from '../components/library/LibraryProviderStatus';
import LibrarySyncStatus from '../components/library/LibrarySyncStatus';
import { ExternalLibraryResource } from '../services/externalLibraries';

// Mock data - would be replaced with actual API calls
const mockResources = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'A comprehensive guide to the basics of machine learning algorithms and applications.',
    type: 'PDF',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    author: 'Dr. Jane Smith',
    publishedDate: '2023-01-15',
    categories: ['Computer Science', 'Artificial Intelligence'],
    tags: ['machine learning', 'AI', 'algorithms'],
    institutionId: null,
    rating: 4.8,
    bookmarks: 156,
    featured: true,
    createdBy: '1',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    downloadUrl: 'resources/introduction-to-machine-learning.pdf',
    offlineAvailable: true,
    fileSize: 2500000
  },
  {
    id: '2',
    title: 'Advanced Database Systems',
    description: 'Explore the principles and practices of modern database management systems.',
    type: 'VIDEO',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    author: 'Prof. Michael Johnson',
    publishedDate: '2023-02-20',
    categories: ['Computer Science', 'Database Management'],
    tags: ['SQL', 'NoSQL', 'database design'],
    institutionId: null,
    rating: 4.5,
    bookmarks: 98,
    featured: false,
    createdBy: '3',
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
    downloadUrl: 'resources/advanced-database-systems.mp4',
    offlineAvailable: true,
    fileSize: 150000000
  },
  {
    id: '3',
    title: 'Principles of Economics',
    description: 'An introduction to microeconomics and macroeconomics concepts.',
    type: 'PDF',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: 'Dr. Robert Chen',
    publishedDate: '2023-03-10',
    categories: ['Economics', 'Business'],
    tags: ['microeconomics', 'macroeconomics', 'finance'],
    institutionId: null,
    rating: 4.2,
    bookmarks: 76,
    featured: false,
    createdBy: '3',
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    downloadUrl: 'resources/principles-of-economics.pdf',
    offlineAvailable: true,
    fileSize: 3200000
  },
  {
    id: '4',
    title: 'History of Modern Art',
    description: 'A journey through the evolution of art from the 19th century to present day.',
    type: 'PDF',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1045&q=80',
    author: 'Prof. Emily Williams',
    publishedDate: '2023-04-05',
    categories: ['Art History', 'Humanities'],
    tags: ['modern art', 'art movements', 'artists'],
    institutionId: null,
    rating: 4.7,
    bookmarks: 112,
    featured: true,
    createdBy: '3',
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-04-05T00:00:00Z',
    downloadUrl: 'resources/history-of-modern-art.pdf',
    offlineAvailable: true,
    fileSize: 4800000
  },
  {
    id: '5',
    title: 'Introduction to Quantum Physics',
    description: 'Understand the fundamental principles of quantum mechanics and its applications.',
    type: 'VIDEO',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: 'Dr. Alan Thompson',
    publishedDate: '2023-05-12',
    categories: ['Physics', 'Quantum Mechanics'],
    tags: ['quantum physics', 'physics', 'quantum mechanics'],
    institutionId: null,
    rating: 4.9,
    bookmarks: 203,
    featured: true,
    createdBy: '3',
    createdAt: '2023-05-12T00:00:00Z',
    updatedAt: '2023-05-12T00:00:00Z',
    downloadUrl: 'resources/introduction-to-quantum-physics.mp4',
    offlineAvailable: true,
    fileSize: 180000000
  },
  {
    id: '6',
    title: 'Organic Chemistry Fundamentals',
    description: 'Learn about organic compounds, reactions, and laboratory techniques.',
    type: 'AUDIO',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: 'Prof. Sarah Martinez',
    publishedDate: '2023-06-18',
    categories: ['Chemistry', 'Organic Chemistry'],
    tags: ['chemistry', 'organic chemistry', 'compounds'],
    institutionId: null,
    rating: 4.3,
    bookmarks: 87,
    featured: false,
    createdBy: '3',
    createdAt: '2023-06-18T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z',
    downloadUrl: 'resources/organic-chemistry-fundamentals.mp3',
    offlineAvailable: true,
    fileSize: 45000000
  }
];

const categories = [
  'All Categories',
  'Computer Science',
  'Economics',
  'Art History',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Literature',
  'History',
  'Biology'
];

const resourceTypes = [
  { label: 'All Types', value: 'ALL' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'Audio', value: 'AUDIO' }
];

const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [featuredResources, setFeaturedResources] = useState<typeof mockResources>([]);
  const [bookmarkedResources, setBookmarkedResources] = useState<Record<string, boolean>>({});
  const [offlineResources, setOfflineResources] = useState<Record<string, boolean>>({});
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState('internal');
  const [resources, setResources] = useState(mockResources);
  const [importedResources, setImportedResources] = useState<ExternalLibraryResource[]>([]);
  
  // Set featured resources on component mount
  useEffect(() => {
    setFeaturedResources(mockResources.filter(resource => resource.featured));
    
    // Check which resources are available offline
    const checkOfflineResources = async () => {
      const offlineStatus: Record<string, boolean> = {};
      
      for (const resource of mockResources) {
        offlineStatus[resource.id] = await isResourceAvailableOffline(resource.id);
      }
      
      setOfflineResources(offlineStatus);
    };
    
    checkOfflineResources();
    
    // Set up online/offline event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Filter resources based on search query, category, type, and offline availability
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                            resource.categories.includes(selectedCategory);
    
    const matchesType = selectedType === 'ALL' || resource.type === selectedType;
    
    const matchesOffline = !showOfflineOnly || offlineResources[resource.id];
    
    return matchesSearch && matchesCategory && matchesType && matchesOffline;
  });
  
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
  
  const toggleBookmark = (id: string) => {
    setBookmarkedResources(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleOfflineStatusChange = (resourceId: string, isAvailableOffline: boolean) => {
    setOfflineResources(prev => ({
      ...prev,
      [resourceId]: isAvailableOffline
    }));
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleImportExternalResource = (resource: ExternalLibraryResource) => {
    // Add the imported resource to our local state
    setImportedResources(prev => [...prev, resource]);
    
    // Convert to internal resource format and add to resources
    const newResource = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type as any,
      url: resource.url,
      thumbnailUrl: resource.thumbnailUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      author: resource.author,
      publishedDate: resource.publishedDate,
      categories: resource.categories,
      tags: resource.tags,
      institutionId: null,
      rating: 0,
      bookmarks: 0,
      featured: false,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadUrl: resource.downloadUrl,
      offlineAvailable: false,
      fileSize: resource.fileSize
    };
    
    setResources(prev => [...prev, newResource]);
  };
  
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">E-Library</h1>
        <p className="text-indigo-100">Discover a world of knowledge at your fingertips</p>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for books, videos, articles, and more..."
              className="block w-full pl-12 pr-4 py-3 border-0 rounded-full shadow-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:text-sm transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-1.5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    id="type"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="offlineOnly"
                    name="offlineOnly"
                    type="checkbox"
                    checked={showOfflineOnly}
                    onChange={(e) => setShowOfflineOnly(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="offlineOnly" className="ml-2 block text-sm text-gray-900 flex items-center">
                    <HardDrive className="h-4 w-4 mr-1 text-indigo-500" />
                    Show offline resources only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('internal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'internal'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="inline-block h-5 w-5 mr-2" />
              Internal Library
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'external'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="inline-block h-5 w-5 mr-2" />
              External Libraries
            </button>
          </nav>
        </div>
      </div>
      
      {!isOnline && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <WifiOff className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are currently offline. Only resources that you've downloaded for offline use will be available.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'internal' ? (
        <>
          {featuredResources.length > 0 && !searchQuery && selectedCategory === 'All Categories' && selectedType === 'ALL' && !showOfflineOnly && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                Featured Resources
              </h2>
              
              <div className="relative">
                <div className="flex overflow-x-auto pb-4 -mx-2 scrollbar-hide">
                  {featuredResources.map((resource) => (
                    <div key={resource.id} className="px-2 w-80 flex-shrink-0">
                      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={resource.thumbnailUrl} 
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <Star size={12} className="mr-1" />
                              Featured
                            </span>
                          </div>
                          {offlineResources[resource.id] && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <HardDrive size={12} className="mr-1" />
                                Offline
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <span className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                              {getResourceIcon(resource.type)}
                              <span className="ml-1">{resource.type}</span>
                            </span>
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < Math.floor(resource.rating) ? 'fill-current' : 'stroke-current'} 
                                />
                               ))}
                              <span className="ml-1 text-xs text-gray-600">{resource.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                          <p className="text-xs text-gray-500 mb-3">By {resource.author}</p>
                          
                          <div className="flex justify-between items-center">
                            <a 
                              href={`/resources/${resource.id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                              View Resource
                            </a>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => toggleBookmark(resource.id)}
                                className={`p-1.5 rounded-full ${
                                  bookmarkedResources[resource.id] 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                                } transition-colors duration-200`}
                              >
                                <Bookmark className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
              {searchQuery || selectedCategory !== 'All Categories' || selectedType !== 'ALL' || showOfflineOnly
                ? 'Search Results' 
                : 'All Resources'}
            </h2>
            
            {filteredResources.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {filteredResources.length} resources
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-48 overflow-hidden relative group">
                    <img 
                      src={resource.thumbnailUrl} 
                      alt={resource.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors duration-200">
                              <Heart size={16} />
                            </button>
                            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors duration-200">
                              <Share2 size={16} />
                            </button>
                          </div>
                          <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors duration-200">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {resource.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <Star size={12} className="mr-1" />
                          Featured
                        </span>
                      </div>
                    )}
                    {offlineResources[resource.id] && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <HardDrive size={12} className="mr-1" />
                          Offline
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                        {getResourceIcon(resource.type)}
                        <span className="ml-1">{resource.type}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(resource.publishedDate).toLocaleDateString()}
                      </span>
                      {resource.fileSize && (
                        <span className="ml-2 text-xs text-gray-500">
                          {formatBytes(resource.fileSize)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-700 transition-colors duration-200">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                    <p className="text-xs text-gray-500 mb-3">By {resource.author}</p>
                    
                    <div className="flex flex-wrap mb-4">
                      {resource.categories.map((category) => (
                        <span 
                          key={category} 
                          className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mr-1 mb-1 hover:bg-indigo-200 transition-colors duration-200 cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={`/resources/${resource.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        View Resource
                      </a>
                      <div className="flex items-center">
                        <div className="flex items-center mr-2 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < Math.floor(resource.rating) ? 'fill-current' : 'stroke-current'} 
                            />
                          ))}
                          <span className="ml-1 text-xs text-gray-600">{resource.rating}</span>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(resource.id)}
                          className={`p-1.5 rounded-full ${
                            bookmarkedResources[resource.id] 
                              ? 'text-indigo-600 bg-indigo-50' 
                              : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                          } transition-colors duration-200`}
                          title={bookmarkedResources[resource.id] ? "Remove bookmark" : "Add bookmark"}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedResources[resource.id] ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <DownloadResourceButton 
                        resourceId={resource.id}
                        variant="outline"
                        size="sm"
                        onStatusChange={(status) => handleOfflineStatusChange(resource.id, status)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-md">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedType('ALL');
                    setShowOfflineOnly(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {filteredResources.length > 6 && (
            <div className="mt-10 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Load More Resources
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <ExternalLibrarySearch onImportResource={handleImportExternalResource} />
          <LibraryProviderStatus />
          <LibrarySyncStatus />
        </>
      )}
      
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <HardDrive className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Your Learning Materials Anywhere</h3>
            <p className="text-gray-600 mb-4">Download resources for offline access and continue learning even when you don't have an internet connection.</p>
            <div className="flex flex-wrap gap-2">
              <a href="/settings/offline" className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Manage Offline Resources
              </a>
              <a href="/achievements" className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-xs font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                View Achievements
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;