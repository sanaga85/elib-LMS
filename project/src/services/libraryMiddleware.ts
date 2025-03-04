import { ExternalLibraryResource } from './externalLibraries';
import { Resource } from '../types';
import axios from 'axios';
import localforage from 'localforage';

// Configure localforage for library cache
const libraryCache = localforage.createInstance({
  name: 'e-library-lms',
  storeName: 'library_cache'
});

// Types for the middleware
interface LibraryMiddlewareConfig {
  cacheEnabled: boolean;
  cacheDuration: number; // in milliseconds
  retryAttempts: number;
  retryDelay: number; // in milliseconds
  timeout: number; // in milliseconds
}

// Default configuration
const defaultConfig: LibraryMiddlewareConfig = {
  cacheEnabled: true,
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000 // 10 seconds
};

/**
 * Library Middleware Service
 * 
 * This service provides a unified interface for accessing resources from
 * multiple external library APIs, with caching, error handling, and retry logic.
 */
class LibraryMiddlewareService {
  private config: LibraryMiddlewareConfig;
  
  constructor(config: Partial<LibraryMiddlewareConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  /**
   * Standardize a resource from any external library API
   */
  standardizeResource(resource: any, source: string): ExternalLibraryResource {
    // Base standardized resource
    const standardized: ExternalLibraryResource = {
      id: resource.id || `${source}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: resource.title || 'Unknown Title',
      description: resource.description || 'No description available',
      type: this.mapResourceType(resource.type || resource.format || resource.mediaType || 'OTHER'),
      url: resource.url || resource.accessUrl || resource.link || '',
      thumbnailUrl: resource.thumbnailUrl || resource.coverImage || resource.imageUrl || 
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      author: resource.author || resource.creator || resource.authors?.join(', ') || 'Unknown Author',
      publishedDate: resource.publishedDate || resource.date || resource.publicationDate || new Date().toISOString().split('T')[0],
      categories: Array.isArray(resource.categories) ? resource.categories : 
                 Array.isArray(resource.subjects) ? resource.subjects : 
                 resource.category ? [resource.category] : 
                 resource.subject ? [resource.subject] : [],
      tags: Array.isArray(resource.tags) ? resource.tags : 
            Array.isArray(resource.keywords) ? resource.keywords : 
            resource.tag ? [resource.tag] : [],
      source: source,
      sourceId: resource.sourceId || resource.id || '',
      downloadUrl: resource.downloadUrl || resource.pdfUrl || resource.downloadLink || undefined,
      fileSize: resource.fileSize || resource.size || undefined,
      language: resource.language || undefined,
      publisher: resource.publisher || undefined,
      isbn: resource.isbn || resource.identifier || undefined,
      license: resource.license || resource.rights || undefined,
      lastSyncedAt: new Date().toISOString()
    };
    
    // Clean up arrays to ensure they contain only strings
    standardized.categories = standardized.categories
      .filter(item => typeof item === 'string' && item.trim() !== '')
      .map(item => item.trim());
    
    standardized.tags = standardized.tags
      .filter(item => typeof item === 'string' && item.trim() !== '')
      .map(item => item.trim());
    
    return standardized;
  }
  
  /**
   * Map various resource types to standardized types
   */
  private mapResourceType(type: string): string {
    if (!type) return 'OTHER';
    
    const typeStr = typeof type === 'string' ? type.toLowerCase() : '';
    
    if (typeStr.includes('pdf')) return 'PDF';
    if (typeStr.includes('epub')) return 'EPUB';
    if (typeStr.includes('video') || typeStr.includes('movie')) return 'VIDEO';
    if (typeStr.includes('audio') || typeStr.includes('sound')) return 'AUDIO';
    if (typeStr.includes('html') || typeStr.includes('text')) return 'HTML';
    
    return 'OTHER';
  }
  
  /**
   * Convert an external library resource to an internal resource
   */
  convertToInternalResource(externalResource: ExternalLibraryResource): Resource {
    return {
      id: externalResource.id,
      title: externalResource.title,
      description: externalResource.description,
      type: externalResource.type as any,
      url: externalResource.url,
      thumbnailUrl: externalResource.thumbnailUrl,
      author: externalResource.author,
      publishedDate: externalResource.publishedDate,
      categories: externalResource.categories,
      tags: externalResource.tags,
      institutionId: null, // External resources are available to all institutions
      rating: 0, // No ratings yet
      bookmarks: 0, // No bookmarks yet
      featured: false, // Not featured by default
      createdBy: 'system', // Created by the system
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadUrl: externalResource.downloadUrl,
      offlineAvailable: false,
      fileSize: externalResource.fileSize
    };
  }
  
  /**
   * Make an API request with retry logic and caching
   */
  async makeRequest<T>(url: string, options: any = {}): Promise<T> {
    const cacheKey = `api_${url}_${JSON.stringify(options)}`;
    
    // Check cache if enabled
    if (this.config.cacheEnabled) {
      try {
        const cachedData = await libraryCache.getItem<{ data: T, timestamp: number }>(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < this.config.cacheDuration) {
          console.log(`Using cached data for ${url}`);
          return cachedData.data;
        }
      } catch (error) {
        console.warn('Error reading from cache:', error);
      }
    }
    
    // Make the request with retry logic
    let attempts = 0;
    let lastError: any;
    
    while (attempts < this.config.retryAttempts) {
      try {
        const response = await axios({
          url,
          ...options,
          timeout: this.config.timeout
        });
        
        // Cache the response if enabled
        if (this.config.cacheEnabled) {
          try {
            await libraryCache.setItem(cacheKey, {
              data: response.data,
              timestamp: Date.now()
            });
          } catch (error) {
            console.warn('Error writing to cache:', error);
          }
        }
        
        return response.data;
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts < this.config.retryAttempts) {
          console.warn(`Request failed, retrying (${attempts}/${this.config.retryAttempts}):`, error);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Clear the cache for a specific key or all keys
   */
  async clearCache(key?: string): Promise<void> {
    if (key) {
      await libraryCache.removeItem(key);
    } else {
      await libraryCache.clear();
    }
  }
  
  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ keys: string[], size: number }> {
    const keys: string[] = [];
    let size = 0;
    
    await libraryCache.iterate((value, key) => {
      keys.push(key);
      size += JSON.stringify(value).length;
    });
    
    return { keys, size };
  }
}

// Create and export a singleton instance
export const libraryMiddleware = new LibraryMiddlewareService();