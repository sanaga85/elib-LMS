import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Bookmark, 
  Share2, 
  Eye, 
  ArrowLeft, 
  HardDrive, 
  AlertCircle,
  FileText,
  Video,
  Headphones,
  ExternalLink
} from 'lucide-react';
import ReadingMode from './ReadingMode';
import { isResourceAvailableOffline, getOfflineResource } from '../../services/offline';
import DownloadResourceButton from '../offline/DownloadResourceButton';

interface ResourceViewerProps {
  resource: {
    id: string;
    title: string;
    description: string;
    type: string;
    url: string;
    thumbnailUrl: string;
    author: string;
    publishedDate: string;
    categories: string[];
    tags: string[];
    downloadUrl?: string;
    fileSize?: number;
  };
  onBack?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({
  resource,
  onBack,
  onBookmark,
  isBookmarked = false
}) => {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  
  useEffect(() => {
    const checkOfflineAvailability = async () => {
      const available = await isResourceAvailableOffline(resource.id);
      setIsOfflineAvailable(available);
    };
    
    checkOfflineAvailability();
  }, [resource.id]);
  
  useEffect(() => {
    const loadResource = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if resource is available offline
        if (await isResourceAvailableOffline(resource.id)) {
          const offlineResource = await getOfflineResource(resource.id);
          if (offlineResource) {
            // Handle different resource types
            if (resource.type === 'PDF') {
              // For PDFs, we'd use a PDF viewer library
              setContent(`<div class="flex items-center justify-center h-full">
                <iframe src="${offlineResource.url}" width="100%" height="600" style="border: none;"></iframe>
              </div>`);
              setTotalPages(10); // This would be determined by the PDF
            } else if (resource.type === 'VIDEO') {
              setContent(`<div class="flex items-center justify-center h-full">
                <video controls width="100%" src="${offlineResource.url}"></video>
              </div>`);
              setTotalPages(1);
            } else if (resource.type === 'AUDIO') {
              setContent(`<div class="flex items-center justify-center h-full">
                <audio controls src="${offlineResource.url}" style="width: 100%;"></audio>
              </div>`);
              setTotalPages(1);
            } else {
              // Default to showing as text/HTML
              setContent(`<div class="prose max-w-none">
                <h1>${resource.title}</h1>
                <p class="text-sm text-gray-500">By ${resource.author}</p>
                <p>${resource.description}</p>
                <p>This is a placeholder for the actual content of the resource.</p>
              </div>`);
              setTotalPages(1);
            }
          } else {
            throw new Error('Failed to load offline resource');
          }
        } else {
          // Online resource loading
          // In a real implementation, this would fetch the actual content
          if (resource.type === 'PDF') {
            setContent(`<div class="flex items-center justify-center h-full">
              <iframe src="${resource.url}" width="100%" height="600" style="border: none;"></iframe>
            </div>`);
            setTotalPages(10);
          } else if (resource.type === 'VIDEO') {
            setContent(`<div class="flex items-center justify-center h-full">
              <video controls width="100%" src="${resource.url}"></video>
            </div>`);
            setTotalPages(1);
          } else if (resource.type === 'AUDIO') {
            setContent(`<div class="flex items-center justify-center h-full">
              <audio controls src="${resource.url}" style="width: 100%;"></audio>
            </div>`);
            setTotalPages(1);
          } else {
            setContent(`<div class="prose max-w-none">
              <h1>${resource.title}</h1>
              <p class="text-sm text-gray-500">By ${resource.author}</p>
              <p>${resource.description}</p>
              <p>This is a placeholder for the actual content of the resource.</p>
            </div>`);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error('Error loading resource:', err);
        setError('Failed to load resource. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResource();
  }, [resource]);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing resource:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };
  
  const handleDownload = () => {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real implementation, this would load the content for the specified page
  };
  
  const getResourceTypeIcon = () => {
    switch (resource.type) {
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
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  const formatBytes = (bytes?: number, decimals = 2) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  if (isReadingMode) {
    return (
      <ReadingMode
        content={content}
        title={resource.title}
        resourceType={resource.type}
        onClose={() => setIsReadingMode(false)}
        onBookmark={onBookmark}
        isBookmarked={isBookmarked}
        onShare={handleShare}
        onDownload={handleDownload}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-indigo-600" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            {getResourceTypeIcon()}
            <span className="ml-2">Resource Viewer</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsReadingMode(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Eye size={16} className="mr-1" />
            Reading Mode
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[400px]">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Details</h3>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium">{resource.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Published Date</p>
                    <p className="font-medium">{formatDate(resource.publishedDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resource Type</p>
                    <p className="font-medium flex items-center">
                      {getResourceTypeIcon()}
                      <span className="ml-1">{resource.type}</span>
                    </p>
                  </div>
                  {resource.fileSize && (
                    <div>
                      <p className="text-sm text-gray-500">File Size</p>
                      <p className="font-medium">{formatBytes(resource.fileSize)}</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.categories.map((category, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsReadingMode(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Eye size={16} className="mr-2" />
                  Read Now
                </button>
                
                {resource.downloadUrl && (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </button>
                
                <button
                  onClick={onBookmark}
                  className={`w-full flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isBookmarked 
                      ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Bookmark size={16} className={`mr-2 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                </button>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Offline Access</p>
                  <DownloadResourceButton 
                    resourceId={resource.id}
                    variant="primary"
                    size="md"
                    onStatusChange={(status) => setIsOfflineAvailable(status)}
                  />
                  
                  {isOfflineAvailable && (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <HardDrive size={14} className="mr-1" />
                      Available offline
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Resources</h3>
              
              <div className="space-y-4">
                {/* This would be populated with actual related resources */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                      alt="Related resource" 
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Advanced Topics in Machine Learning</p>
                    <p className="text-xs text-gray-500">By Dr. Jane Smith</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                      alt="Related resource" 
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Neural Networks Fundamentals</p>
                    <p className="text-xs text-gray-500">By Prof. Michael Johnson</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                      alt="Related resource" 
                      className="h-10 w-10 object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Data Science for Beginners</p>
                    <p className="text-xs text-gray-500">By Dr. Robert Chen</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                  View all related resources
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceViewer;