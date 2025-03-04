import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import ResourceViewer from '../components/reader/ResourceViewer';
import { useResourceStore } from '../store/resourceStore';

const ResourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, toggleBookmark, bookmarkedResources } = useResourceStore();
  const [resource, setResource] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadResource = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch the resource from the API
        // For now, we'll use the mock data from the store
        if (!id) {
          throw new Error('Resource ID is required');
        }
        
        const foundResource = resources.find(r => r.id === id);
        
        if (!foundResource) {
          throw new Error('Resource not found');
        }
        
        setResource(foundResource);
      } catch (err) {
        console.error('Error loading resource:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResource();
  }, [id, resources]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleBookmark = () => {
    if (resource) {
      toggleBookmark(resource.id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error || !resource) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Error</h1>
        </div>
        <p className="text-red-600">{error || 'Resource not found'}</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <ResourceViewer
      resource={resource}
      onBack={handleBack}
      onBookmark={handleBookmark}
      isBookmarked={!!bookmarkedResources[resource.id]}
    />
  );
};

export default ResourceDetails;