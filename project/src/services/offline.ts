import localforage from 'localforage';
import { Storage } from 'aws-amplify';
import { resourceAPI } from './api';

// Configure localforage
localforage.config({
  name: 'e-library-lms',
  storeName: 'offline_resources'
});

// Types
interface OfflineResource {
  id: string;
  title: string;
  type: string;
  localUrl: string;
  size: number;
  downloadedAt: string;
  expiresAt?: string;
}

// Initialize offline storage
export const initOfflineStorage = () => {
  // Create stores if they don't exist
  localforage.getItem('resources').then(resources => {
    if (!resources) {
      localforage.setItem('resources', []);
    }
  });
  
  localforage.getItem('metadata').then(metadata => {
    if (!metadata) {
      localforage.setItem('metadata', {
        lastSyncTime: null,
        totalStorageUsed: 0,
        maxStorageSize: 500 * 1024 * 1024 // 500MB default
      });
    }
  });
};

// Get all offline resources
export const getOfflineResources = async (): Promise<OfflineResource[]> => {
  try {
    const resources = await localforage.getItem<OfflineResource[]>('resources');
    return resources || [];
  } catch (error) {
    console.error('Error getting offline resources:', error);
    return [];
  }
};

// Check if a resource is available offline
export const isResourceAvailableOffline = async (resourceId: string): Promise<boolean> => {
  try {
    const resources = await getOfflineResources();
    return resources.some(resource => resource.id === resourceId);
  } catch (error) {
    console.error('Error checking if resource is available offline:', error);
    return false;
  }
};

// Download a resource for offline use
export const downloadResourceForOffline = async (resourceId: string): Promise<boolean> => {
  try {
    // Check if already downloaded
    const isAlreadyDownloaded = await isResourceAvailableOffline(resourceId);
    if (isAlreadyDownloaded) {
      return true;
    }
    
    // Get resource details from API
    const response = await resourceAPI.getResource(resourceId);
    const resource = response.getResource;
    
    if (!resource || !resource.downloadUrl) {
      throw new Error('Resource not found or download URL not available');
    }
    
    // Download the file from S3
    const result = await Storage.get(resource.downloadUrl, { download: true });
    
    if (!result.Body) {
      throw new Error('Failed to download resource');
    }
    
    // Convert to blob and store locally
    const blob = result.Body as Blob;
    const localUrl = URL.createObjectURL(blob);
    
    // Store the blob in IndexedDB
    const key = `resource_${resourceId}`;
    await localforage.setItem(key, blob);
    
    // Update resources list
    const resources = await getOfflineResources();
    const newResource: OfflineResource = {
      id: resourceId,
      title: resource.title,
      type: resource.type,
      localUrl: key,
      size: resource.fileSize || blob.size,
      downloadedAt: new Date().toISOString(),
      expiresAt: resource.expiresAt
    };
    
    resources.push(newResource);
    await localforage.setItem('resources', resources);
    
    // Update metadata
    const metadata = await localforage.getItem<any>('metadata') || {};
    metadata.totalStorageUsed = (metadata.totalStorageUsed || 0) + newResource.size;
    metadata.lastSyncTime = new Date().toISOString();
    await localforage.setItem('metadata', metadata);
    
    return true;
  } catch (error) {
    console.error('Error downloading resource for offline use:', error);
    return false;
  }
};

// Get an offline resource
export const getOfflineResource = async (resourceId: string): Promise<{ blob: Blob, url: string } | null> => {
  try {
    // Check if resource is available offline
    const isAvailable = await isResourceAvailableOffline(resourceId);
    if (!isAvailable) {
      return null;
    }
    
    // Get the blob from IndexedDB
    const key = `resource_${resourceId}`;
    const blob = await localforage.getItem<Blob>(key);
    
    if (!blob) {
      return null;
    }
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    return { blob, url };
  } catch (error) {
    console.error('Error getting offline resource:', error);
    return null;
  }
};

// Remove a resource from offline storage
export const removeOfflineResource = async (resourceId: string): Promise<boolean> => {
  try {
    // Get current resources
    const resources = await getOfflineResources();
    const resourceIndex = resources.findIndex(r => r.id === resourceId);
    
    if (resourceIndex === -1) {
      return false;
    }
    
    const resource = resources[resourceIndex];
    
    // Remove the blob from IndexedDB
    const key = `resource_${resourceId}`;
    await localforage.removeItem(key);
    
    // Update resources list
    resources.splice(resourceIndex, 1);
    await localforage.setItem('resources', resources);
    
    // Update metadata
    const metadata = await localforage.getItem<any>('metadata') || {};
    metadata.totalStorageUsed = Math.max(0, (metadata.totalStorageUsed || 0) - resource.size);
    metadata.lastSyncTime = new Date().toISOString();
    await localforage.setItem('metadata', metadata);
    
    return true;
  } catch (error) {
    console.error('Error removing offline resource:', error);
    return false;
  }
};

// Get offline storage statistics
export const getOfflineStorageStats = async (): Promise<{
  totalItems: number;
  totalStorageUsed: number;
  maxStorageSize: number;
  lastSyncTime: string | null;
}> => {
  try {
    const resources = await getOfflineResources();
    const metadata = await localforage.getItem<any>('metadata') || {};
    
    return {
      totalItems: resources.length,
      totalStorageUsed: metadata.totalStorageUsed || 0,
      maxStorageSize: metadata.maxStorageSize || 500 * 1024 * 1024, // 500MB default
      lastSyncTime: metadata.lastSyncTime
    };
  } catch (error) {
    console.error('Error getting offline storage stats:', error);
    return {
      totalItems: 0,
      totalStorageUsed: 0,
      maxStorageSize: 500 * 1024 * 1024,
      lastSyncTime: null
    };
  }
};

// Clear all offline resources
export const clearAllOfflineResources = async (): Promise<boolean> => {
  try {
    // Get all resources
    const resources = await getOfflineResources();
    
    // Remove all resource blobs
    for (const resource of resources) {
      const key = `resource_${resource.id}`;
      await localforage.removeItem(key);
    }
    
    // Clear resources list
    await localforage.setItem('resources', []);
    
    // Update metadata
    const metadata = await localforage.getItem<any>('metadata') || {};
    metadata.totalStorageUsed = 0;
    metadata.lastSyncTime = new Date().toISOString();
    await localforage.setItem('metadata', metadata);
    
    return true;
  } catch (error) {
    console.error('Error clearing all offline resources:', error);
    return false;
  }
};