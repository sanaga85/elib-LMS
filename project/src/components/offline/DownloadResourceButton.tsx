import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { 
  downloadResourceForOffline, 
  isResourceAvailableOffline, 
  removeOfflineResource 
} from '../../services/offline';

interface DownloadResourceButtonProps {
  resourceId: string;
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onStatusChange?: (isAvailableOffline: boolean) => void;
}

const DownloadResourceButton: React.FC<DownloadResourceButtonProps> = ({
  resourceId,
  className = '',
  buttonText,
  showIcon = true,
  variant = 'primary',
  size = 'md',
  onStatusChange
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, [resourceId]);

  const checkAvailability = async () => {
    try {
      const available = await isResourceAvailableOffline(resourceId);
      setIsAvailable(available);
      if (onStatusChange) {
        onStatusChange(available);
      }
    } catch (err) {
      console.error('Error checking resource availability:', err);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setError(null);
    
    try {
      const success = await downloadResourceForOffline(resourceId);
      
      if (success) {
        setIsAvailable(true);
        if (onStatusChange) {
          onStatusChange(true);
        }
      } else {
        setError('Failed to download resource');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      console.error('Error downloading resource:', err);
      setError('An error occurred while downloading');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRemove = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setError(null);
    
    try {
      const success = await removeOfflineResource(resourceId);
      
      if (success) {
        setIsAvailable(false);
        if (onStatusChange) {
          onStatusChange(false);
        }
      } else {
        setError('Failed to remove resource');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      console.error('Error removing resource:', err);
      setError('An error occurred while removing');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine button styles based on variant and size
  const getButtonStyles = () => {
    let baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors';
    
    // Size styles
    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    
    // Variant styles
    const variantStyles = {
      primary: isAvailable 
        ? 'bg-green-600 hover:bg-green-700 text-white border border-transparent' 
        : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent',
      secondary: isAvailable
        ? 'bg-green-100 hover:bg-green-200 text-green-800 border border-transparent'
        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-transparent',
      outline: isAvailable
        ? 'bg-white hover:bg-green-50 text-green-700 border border-green-300'
        : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300'
    };
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  return (
    <div className="relative">
      <button
        onClick={isAvailable ? handleRemove : handleDownload}
        disabled={isDownloading}
        className={getButtonStyles()}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            {isAvailable ? 'Removing...' : 'Downloading...'}
          </>
        ) : (
          <>
            {showIcon && (
              isAvailable ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )
            )}
            {buttonText || (isAvailable ? 'Available Offline' : 'Download for Offline')}
            {isAvailable && (
              <Trash2 className="h-4 w-4 ml-2 text-red-500" />
            )}
          </>
        )}
      </button>
      
      {showError && error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 text-red-800 text-xs rounded-md z-10">
          <div className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadResourceButton;