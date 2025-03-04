import { v4 as uuidv4 } from 'uuid';
import { Resource } from '../types';
import { libraryMiddleware } from './libraryMiddleware';

// Types for external library APIs
export interface ExternalLibraryResource {
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
  source: string;
  sourceId: string;
  downloadUrl?: string;
  fileSize?: number;
  language?: string;
  publisher?: string;
  isbn?: string;
  license?: string;
  lastSyncedAt?: string;
}

// Base interface for all library API providers
interface LibraryApiProvider {
  name: string;
  searchResources: (query: string, options?: any) => Promise<ExternalLibraryResource[]>;
  getResourceDetails: (id: string) => Promise<ExternalLibraryResource | null>;
  isAvailable: () => Promise<boolean>;
  syncResources?: (since?: string) => Promise<ExternalLibraryResource[]>;
}

// National Digital Library of India (NDLI) API
class NDLIProvider implements LibraryApiProvider {
  name = 'National Digital Library of India';
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const url = `https://ndl.iitkgp.ac.in/api/v1/search?q=${encodeURIComponent(query)}&p=${options.page || 1}&s=${options.size || 10}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return data.docs.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id,
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: item.sourceContentType,
        url: item.accessURL || '',
        thumbnailUrl: item.thumbnailURL || '',
        author: item.creator?.join(', ') || 'Unknown Author',
        publishedDate: item.publishDate || new Date().toISOString().split('T')[0],
        categories: item.subject || [],
        tags: item.keywords || [],
        sourceId: item.id,
        downloadUrl: item.downloadURL,
        fileSize: item.size,
        language: item.language,
        publisher: item.publisher,
        license: item.rights
      }, this.name));
    } catch (error) {
      console.error('Error searching NDLI:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://ndl.iitkgp.ac.in/api/v1/items/${id}`;
      
      const item = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return libraryMiddleware.standardizeResource({
        id: item.id,
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: item.sourceContentType,
        url: item.accessURL || '',
        thumbnailUrl: item.thumbnailURL || '',
        author: item.creator?.join(', ') || 'Unknown Author',
        publishedDate: item.publishDate || new Date().toISOString().split('T')[0],
        categories: item.subject || [],
        tags: item.keywords || [],
        sourceId: item.id,
        downloadUrl: item.downloadURL,
        fileSize: item.size,
        language: item.language,
        publisher: item.publisher,
        license: item.rights
      }, this.name);
    } catch (error) {
      console.error('Error getting NDLI resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://ndl.iitkgp.ac.in/api/v1/status', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true; // If we get here, the API is available
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // NDLI doesn't have a direct sync API, so we'll search for recently added items
      const url = `https://ndl.iitkgp.ac.in/api/v1/search?sort=date_added&order=desc&p=1&s=50`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Filter by date if 'since' is provided
      let results = data.docs;
      if (since) {
        const sinceDate = new Date(since);
        results = results.filter((item: any) => {
          const itemDate = new Date(item.dateAdded || item.publishDate);
          return itemDate > sinceDate;
        });
      }
      
      return results.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id,
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: item.sourceContentType,
        url: item.accessURL || '',
        thumbnailUrl: item.thumbnailURL || '',
        author: item.creator?.join(', ') || 'Unknown Author',
        publishedDate: item.publishDate || new Date().toISOString().split('T')[0],
        categories: item.subject || [],
        tags: item.keywords || [],
        sourceId: item.id,
        downloadUrl: item.downloadURL,
        fileSize: item.size,
        language: item.language,
        publisher: item.publisher,
        license: item.rights
      }, this.name));
    } catch (error) {
      console.error('Error syncing NDLI resources:', error);
      return [];
    }
  }
}

// Open Library API
class OpenLibraryProvider implements LibraryApiProvider {
  name = 'Open Library';
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${options.page || 1}&limit=${options.size || 10}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return data.docs.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.key.replace('/works/', ''),
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: 'PDF',
        url: `https://openlibrary.org${item.key}`,
        thumbnailUrl: item.cover_i 
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` 
          : '',
        author: item.author_name?.join(', ') || 'Unknown Author',
        publishedDate: item.first_publish_year ? `${item.first_publish_year}-01-01` : new Date().toISOString().split('T')[0],
        categories: item.subject || [],
        tags: item.subject_facet || [],
        sourceId: item.key.replace('/works/', ''),
        downloadUrl: item.ia ? `https://archive.org/download/${item.ia[0]}/${item.ia[0]}_pdf.pdf` : undefined,
        isbn: item.isbn ? item.isbn[0] : undefined,
        publisher: item.publisher ? item.publisher[0] : undefined,
        language: item.language ? item.language[0] : undefined
      }, this.name));
    } catch (error) {
      console.error('Error searching Open Library:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://openlibrary.org/works/${id}.json`;
      
      const item = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Get author information
      let authorName = 'Unknown Author';
      if (item.authors && item.authors.length > 0) {
        const authorKey = item.authors[0].author.key;
        const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
        if (authorResponse.ok) {
          const authorData = await authorResponse.json();
          authorName = authorData.name || 'Unknown Author';
        }
      }
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: item.title || 'Unknown Title',
        description: item.description?.value || item.description || 'No description available',
        type: 'PDF',
        url: `https://openlibrary.org/works/${id}`,
        thumbnailUrl: item.covers && item.covers.length > 0
          ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-M.jpg`
          : '',
        author: authorName,
        publishedDate: item.first_publish_date || new Date().toISOString().split('T')[0],
        categories: item.subjects || [],
        tags: item.subject_places || [],
        sourceId: id,
        language: item.language?.key?.replace('/languages/', '')
      }, this.name);
    } catch (error) {
      console.error('Error getting Open Library resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://openlibrary.org/search.json?q=test&limit=1');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // Open Library has a changes API
      const url = `https://openlibrary.org/recentchanges.json?limit=50`;
      
      const changes = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Filter by date if 'since' is provided
      let filteredChanges = changes;
      if (since) {
        const sinceDate = new Date(since);
        filteredChanges = changes.filter((change: any) => {
          const changeDate = new Date(change.timestamp);
          return changeDate > sinceDate;
        });
      }
      
      // Get details for each changed work
      const resources: ExternalLibraryResource[] = [];
      
      for (const change of filteredChanges) {
        if (change.kind === 'work' && change.key.startsWith('/works/')) {
          const id = change.key.replace('/works/', '');
          try {
            const resource = await this.getResourceDetails(id);
            if (resource) {
              resources.push(resource);
            }
          } catch (error) {
            console.error(`Error getting details for work ${id}:`, error);
          }
        }
      }
      
      return resources;
    } catch (error) {
      console.error('Error syncing Open Library resources:', error);
      return [];
    }
  }
}

// Project Gutenberg API
class ProjectGutenbergProvider implements LibraryApiProvider {
  name = 'Project Gutenberg';
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      // Project Gutenberg doesn't have a direct API, so we're using the Gutendex API
      const url = `https://gutendex.com/books/?search=${encodeURIComponent(query)}&page=${options.page || 1}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return data.results.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id.toString(),
        title: item.title || 'Unknown Title',
        description: `A Project Gutenberg eBook${item.subjects ? ' about ' + item.subjects.join(', ') : ''}`,
        type: 'EPUB',
        url: item.gutenberg_url || '',
        thumbnailUrl: '',
        author: item.authors.map((a: any) => a.name).join(', ') || 'Unknown Author',
        publishedDate: new Date().toISOString().split('T')[0], // Gutenberg doesn't provide publication dates
        categories: item.subjects || [],
        tags: item.bookshelves || [],
        sourceId: item.id.toString(),
        downloadUrl: item.formats['application/epub+zip'] || item.formats['text/html'] || undefined,
        language: item.languages ? item.languages[0] : undefined,
        license: 'Public Domain'
      }, this.name));
    } catch (error) {
      console.error('Error searching Project Gutenberg:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://gutendex.com/books/${id}`;
      
      const item = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: item.title || 'Unknown Title',
        description: `A Project Gutenberg eBook${item.subjects ? ' about ' + item.subjects.join(', ') : ''}`,
        type: 'EPUB',
        url: item.gutenberg_url || '',
        thumbnailUrl: '',
        author: item.authors.map((a: any) => a.name).join(', ') || 'Unknown Author',
        publishedDate: new Date().toISOString().split('T')[0],
        categories: item.subjects || [],
        tags: item.bookshelves || [],
        sourceId: id,
        downloadUrl: item.formats['application/epub+zip'] || item.formats['text/html'] || undefined,
        language: item.languages ? item.languages[0] : undefined,
        license: 'Public Domain'
      }, this.name);
    } catch (error) {
      console.error('Error getting Project Gutenberg resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://gutendex.com/books/?search=test');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // Gutendex doesn't have a changes API, so we'll get the most recent books
      const url = `https://gutendex.com/books/?page=1`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return data.results.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id.toString(),
        title: item.title || 'Unknown Title',
        description: `A Project Gutenberg eBook${item.subjects ? ' about ' + item.subjects.join(', ') : ''}`,
        type: 'EPUB',
        url: item.gutenberg_url || '',
        thumbnailUrl: '',
        author: item.authors.map((a: any) => a.name).join(', ') || 'Unknown Author',
        publishedDate: new Date().toISOString().split('T')[0],
        categories: item.subjects || [],
        tags: item.bookshelves || [],
        sourceId: item.id.toString(),
        downloadUrl: item.formats['application/epub+zip'] || item.formats['text/html'] || undefined,
        language: item.languages ? item.languages[0] : undefined,
        license: 'Public Domain'
      }, this.name));
    } catch (error) {
      console.error('Error syncing Project Gutenberg resources:', error);
      return [];
    }
  }
}

// Google Books API
class GoogleBooksProvider implements LibraryApiProvider {
  name = 'Google Books';
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const apiKeyParam = this.apiKey ? `&key=${this.apiKey}` : '';
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${options.page ? (options.page - 1) * (options.size || 10) : 0}&maxResults=${options.size || 10}${apiKeyParam}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.items) return [];
      
      return data.items.map((item: any) => {
        const volumeInfo = item.volumeInfo || {};
        return libraryMiddleware.standardizeResource({
          id: item.id,
          title: volumeInfo.title || 'Unknown Title',
          description: volumeInfo.description || 'No description available',
          type: volumeInfo.readingModes?.pdf ? 'PDF' : volumeInfo.readingModes?.epub ? 'EPUB' : 'OTHER',
          url: volumeInfo.previewLink || volumeInfo.infoLink || '',
          thumbnailUrl: volumeInfo.imageLinks?.thumbnail || '',
          author: volumeInfo.authors?.join(', ') || 'Unknown Author',
          publishedDate: volumeInfo.publishedDate || new Date().toISOString().split('T')[0],
          categories: volumeInfo.categories || [],
          tags: volumeInfo.categories || [],
          sourceId: item.id,
          downloadUrl: item.accessInfo?.epub?.downloadLink || item.accessInfo?.pdf?.downloadLink || undefined,
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
          publisher: volumeInfo.publisher,
          language: volumeInfo.language
        }, this.name);
      });
    } catch (error) {
      console.error('Error searching Google Books:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const apiKeyParam = this.apiKey ? `?key=${this.apiKey}` : '';
      const url = `https://www.googleapis.com/books/v1/volumes/${id}${apiKeyParam}`;
      
      const item = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const volumeInfo = item.volumeInfo || {};
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: volumeInfo.title || 'Unknown Title',
        description: volumeInfo.description || 'No description available',
        type: volumeInfo.readingModes?.pdf ? 'PDF' : volumeInfo.readingModes?.epub ? 'EPUB' : 'OTHER',
        url: volumeInfo.previewLink || volumeInfo.infoLink || '',
        thumbnailUrl: volumeInfo.imageLinks?.thumbnail || '',
        author: volumeInfo.authors?.join(', ') || 'Unknown Author',
        publishedDate: volumeInfo.publishedDate || new Date().toISOString().split('T')[0],
        categories: volumeInfo.categories || [],
        tags: volumeInfo.categories || [],
        sourceId: id,
        downloadUrl: item.accessInfo?.epub?.downloadLink || item.accessInfo?.pdf?.downloadLink || undefined,
        isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
        publisher: volumeInfo.publisher,
        language: volumeInfo.language
      }, this.name);
    } catch (error) {
      console.error('Error getting Google Books resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const apiKeyParam = this.apiKey ? `?key=${this.apiKey}` : '';
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=test&maxResults=1${apiKeyParam}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // Google Books doesn't have a changes API, so we'll search for recently updated books
      const apiKeyParam = this.apiKey ? `&key=${this.apiKey}` : '';
      const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=40${apiKeyParam}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.items) return [];
      
      // Filter by date if 'since' is provided
      let results = data.items;
      if (since) {
        const sinceDate = new Date(since);
        results = results.filter((item: any) => {
          const volumeInfo = item.volumeInfo || {};
          if (!volumeInfo.publishedDate) return false;
          
          const itemDate = new Date(volumeInfo.publishedDate);
          return itemDate > sinceDate;
        });
      }
      
      return results.map((item: any) => {
        const volumeInfo = item.volumeInfo || {};
        return libraryMiddleware.standardizeResource({
          id: item.id,
          title: volumeInfo.title || 'Unknown Title',
          description: volumeInfo.description || 'No description available',
          type: volumeInfo.readingModes?.pdf ? 'PDF' : volumeInfo.readingModes?.epub ? 'EPUB' : 'OTHER',
          url: volumeInfo.previewLink || volumeInfo.infoLink || '',
          thumbnailUrl: volumeInfo.imageLinks?.thumbnail || '',
          author: volumeInfo.authors?.join(', ') || 'Unknown Author',
          publishedDate: volumeInfo.publishedDate || new Date().toISOString().split('T')[0],
          categories: volumeInfo.categories || [],
          tags: volumeInfo.categories || [],
          sourceId: item.id,
          downloadUrl: item.accessInfo?.epub?.downloadLink || item.accessInfo?.pdf?.downloadLink || undefined,
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
          publisher: volumeInfo.publisher,
          language: volumeInfo.language
        }, this.name);
      });
    } catch (error) {
      console.error('Error syncing Google Books resources:', error);
      return [];
    }
  }
}

// Internet Archive API
class InternetArchiveProvider implements LibraryApiProvider {
  name = 'Internet Archive';
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=subject&fl[]=mediatype&fl[]=year&fl[]=downloads&fl[]=format&rows=${options.size || 10}&page=${options.page || 1}&output=json`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const docs = data.response.docs;
      
      return docs.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.identifier,
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: this.mapResourceType(item.mediatype, item.format),
        url: `https://archive.org/details/${item.identifier}`,
        thumbnailUrl: `https://archive.org/services/img/${item.identifier}`,
        author: item.creator || 'Unknown Author',
        publishedDate: item.year ? `${item.year}-01-01` : new Date().toISOString().split('T')[0],
        categories: item.subject ? (Array.isArray(item.subject) ? item.subject : [item.subject]) : [],
        tags: item.subject ? (Array.isArray(item.subject) ? item.subject : [item.subject]) : [],
        sourceId: item.identifier,
        downloadUrl: `https://archive.org/download/${item.identifier}/${item.identifier}.pdf`
      }, this.name));
    } catch (error) {
      console.error('Error searching Internet Archive:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://archive.org/metadata/${id}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const metadata = data.metadata;
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: metadata.title || 'Unknown Title',
        description: metadata.description || 'No description available',
        type: this.mapResourceType(metadata.mediatype, metadata.format),
        url: `https://archive.org/details/${id}`,
        thumbnailUrl: `https://archive.org/services/img/${id}`,
        author: metadata.creator || 'Unknown Author',
        publishedDate: metadata.year ? `${metadata.year}-01-01` : new Date().toISOString().split('T')[0],
        categories: metadata.subject ? (Array.isArray(metadata.subject) ? metadata.subject : [metadata.subject]) : [],
        tags: metadata.subject ? (Array.isArray(metadata.subject) ? metadata.subject : [metadata.subject]) : [],
        sourceId: id,
        downloadUrl: `https://archive.org/download/${id}/${id}.pdf`,
        language: metadata.language,
        publisher: metadata.publisher,
        license: metadata.licenseurl
      }, this.name);
    } catch (error) {
      console.error('Error getting Internet Archive resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://archive.org/advancedsearch.php?q=test&rows=1&output=json');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  private mapResourceType(mediatype: string, format: string | string[]): string {
    if (!mediatype) return 'OTHER';
    
    switch (mediatype.toLowerCase()) {
      case 'texts':
        if (format) {
          const formats = Array.isArray(format) ? format : [format];
          if (formats.some(f => f.toLowerCase().includes('pdf'))) return 'PDF';
          if (formats.some(f => f.toLowerCase().includes('epub'))) return 'EPUB';
        }
        return 'PDF';
      case 'movies':
      case 'video':
        return 'VIDEO';
      case 'audio':
        return 'AUDIO';
      default:
        return 'OTHER';
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // Internet Archive has a changes API
      const url = `https://archive.org/services/search/v1/scrape?q=mediatype:texts&sort=date:desc&count=50`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Filter by date if 'since' is provided
      let results = data.items || [];
      if (since) {
        const sinceDate = new Date(since);
        results = results.filter((item: any) => {
          if (!item.publicdate) return false;
          
          const itemDate = new Date(item.publicdate);
          return itemDate > sinceDate;
        });
      }
      
      return results.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.identifier,
        title: item.title || 'Unknown Title',
        description: item.description || 'No description available',
        type: this.mapResourceType(item.mediatype, item.format),
        url: `https://archive.org/details/${item.identifier}`,
        thumbnailUrl: `https://archive.org/services/img/${item.identifier}`,
        author: item.creator || 'Unknown Author',
        publishedDate: item.year ? `${item.year}-01-01` : item.publicdate || new Date().toISOString().split('T')[0],
        categories: item.subject ? (Array.isArray(item.subject) ? item.subject : [item.subject]) : [],
        tags: item.subject ? (Array.isArray(item.subject) ? item.subject : [item.subject]) : [],
        sourceId: item.identifier,
        downloadUrl: `https://archive.org/download/${item.identifier}/${item.identifier}.pdf`,
        language: item.language,
        publisher: item.publisher,
        license: item.licenseurl
      }, this.name));
    } catch (error) {
      console.error('Error syncing Internet Archive resources:', error);
      return [];
    }
  }
}

// Europeana API
class EuropeanaProvider implements LibraryApiProvider {
  name = 'Europeana';
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Europeana API key is required');
      }
      
      const url = `https://api.europeana.eu/record/v2/search.json?wskey=${this.apiKey}&query=${encodeURIComponent(query)}&rows=${options.size || 10}&start=${options.page ? (options.page - 1) * (options.size || 10) + 1 : 1}&profile=rich`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.items) return [];
      
      return data.items.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id,
        title: item.title?.[0] || 'Unknown Title',
        description: item.dcDescription?.[0] || 'No description available',
        type: this.mapResourceType(item.type),
        url: item.guid || '',
        thumbnailUrl: item.edmPreview?.[0] || '',
        author: item.dcCreator?.[0] || 'Unknown Author',
        publishedDate: item.year?.[0] || new Date().toISOString().split('T')[0],
        categories: item.edmConcept || [],
        tags: item.edmTag || [],
        sourceId: item.id,
        downloadUrl: item.edmIsShownAt?.[0] || undefined,
        language: item.language?.[0],
        publisher: item.edmProvider?.[0],
        license: item.rights?.[0]
      }, this.name));
    } catch (error) {
      console.error('Error searching Europeana:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      if (!this.apiKey) {
        throw new Error('Europeana API key is required');
      }
      
      const url = `https://api.europeana.eu/record/v2${id}.json?wskey=${this.apiKey}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const item = data.object;
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: item.title?.[0] || 'Unknown Title',
        description: item.dcDescription?.[0] || 'No description available',
        type: this.mapResourceType(item.type),
        url: item.guid || '',
        thumbnailUrl: item.edmPreview?.[0] || '',
        author: item.dcCreator?.[0] || 'Unknown Author',
        publishedDate: item.year?.[0] || new Date().toISOString().split('T')[0],
        categories: item.edmConcept || [],
        tags: item.edmTag || [],
        sourceId: id,
        downloadUrl: item.edmIsShownAt?.[0] || undefined,
        language: item.language?.[0],
        publisher: item.edmProvider?.[0],
        license: item.rights?.[0]
      }, this.name);
    } catch (error) {
      console.error('Error getting Europeana resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      if (!this.apiKey) return false;
      
      const response = await fetch(`https://api.europeana.eu/record/v2/search.json?wskey=${this.apiKey}&query=test&rows=1`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  private mapResourceType(type: string): string {
    if (!type) return 'OTHER';
    
    const typeStr = Array.isArray(type) ? type[0] : type;
    
    switch (typeStr.toLowerCase()) {
      case 'text':
        return 'PDF';
      case 'video':
        return 'VIDEO';
      case 'sound':
        return 'AUDIO';
      case 'image':
        return 'OTHER';
      default:
        return 'OTHER';
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Europeana API key is required');
      }
      
      // Europeana doesn't have a changes API, so we'll search for recently added items
      const url = `https://api.europeana.eu/record/v2/search.json?wskey=${this.apiKey}&query=timestamp_created:[${since || '*'} TO NOW]&rows=50&profile=rich`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.items) return [];
      
      return data.items.map((item: any) => libraryMiddleware.standardizeResource({
        id: item.id,
        title: item.title?.[0] || 'Unknown Title',
        description: item.dcDescription?.[0] || 'No description available',
        type: this.mapResourceType(item.type),
        url: item.guid || '',
        thumbnailUrl: item.edmPreview?.[0] || '',
        author: item.dcCreator?.[0] || 'Unknown Author',
        publishedDate: item.year?.[0] || new Date().toISOString().split('T')[0],
        categories: item.edmConcept || [],
        tags: item.edmTag || [],
        sourceId: item.id,
        downloadUrl: item.edmIsShownAt?.[0] || undefined,
        language: item.language?.[0],
        publisher: item.edmProvider?.[0],
        license: item.rights?.[0]
      }, this.name));
    } catch (error) {
      console.error('Error syncing Europeana resources:', error);
      return [];
    }
  }
}

// HathiTrust Digital Library API
class HathiTrustProvider implements LibraryApiProvider {
  name = 'HathiTrust Digital Library';
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const url = `https://catalog.hathitrust.org/api/volumes/brief/json/${encodeURIComponent(query)}?limit=${options.size || 10}&start=${options.page ? (options.page - 1) * (options.size || 10) : 0}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const items = data.items || [];
      const resources: ExternalLibraryResource[] = [];
      
      for (const key in items) {
        if (items.hasOwnProperty(key)) {
          const item = items[key];
          const record = item.records?.[Object.keys(item.records)[0]];
          
          if (record) {
            resources.push(libraryMiddleware.standardizeResource({
              id: key,
              title: record.title || 'Unknown Title',
              description: record.title || 'No description available',
              type: 'PDF',
              url: `https://catalog.hathitrust.org/Record/${key}`,
              thumbnailUrl: '',
              author: record.creator || 'Unknown Author',
              publishedDate: record.publishDate || new Date().toISOString().split('T')[0],
              categories: record.subject || [],
              tags: record.subject || [],
              sourceId: key,
              isbn: record.isbns?.[0],
              publisher: record.publisher,
              language: record.language
            }, this.name));
          }
        }
      }
      
      return resources;
    } catch (error) {
      console.error('Error searching HathiTrust:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://catalog.hathitrust.org/api/volumes/full/json/${id}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const record = data.records?.[id];
      
      if (!record) {
        return null;
      }
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: record.title || 'Unknown Title',
        description: record.title || 'No description available',
        type: 'PDF',
        url: `https://catalog.hathitrust.org/Record/${id}`,
        thumbnailUrl: '',
        author: record.creator || 'Unknown Author',
        publishedDate: record.publishDate || new Date().toISOString().split('T')[0],
        categories: record.subject || [],
        tags: record.subject || [],
        sourceId: id,
        isbn: record.isbns?.[0],
        publisher: record.publisher,
        language: record.language
      }, this.name);
    } catch (error) {
      console.error('Error getting HathiTrust resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://catalog.hathitrust.org/api/volumes/brief/json/test?limit=1');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    // HathiTrust doesn't have a changes API, so we'll just return some popular items
    try {
      const queries = ['science', 'history', 'literature', 'philosophy', 'art'];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      return await this.searchResources(randomQuery, { size: 20 });
    } catch (error) {
      console.error('Error syncing HathiTrust resources:', error);
      return [];
    }
  }
}

// World Digital Library API
class WorldDigitalLibraryProvider implements LibraryApiProvider {
  name = 'World Digital Library';
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      // Note: World Digital Library API is no longer active as the project ended in 2021
      // This is a placeholder implementation that would work if the API was still active
      return [];
    } catch (error) {
      console.error('Error searching World Digital Library:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      // Note: World Digital Library API is no longer active
      return null;
    } catch (error) {
      console.error('Error getting World Digital Library resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    // World Digital Library is no longer available
    return false;
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    return [];
  }
}

// Directory of Open Access Books (DOAB) API
class DOABProvider implements LibraryApiProvider {
  name = 'Directory of Open Access Books';
  private apiKey: string;
  
  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }
  
  async searchResources(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    try {
      const url = `https://directory.doabooks.org/rest/search?query=${encodeURIComponent(query)}&expand=metadata&limit=${options.size || 10}&offset=${options.page ? (options.page - 1) * (options.size || 10) : 0}`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.searchResults || !data.searchResults.searchResult) {
        return [];
      }
      
      return data.searchResults.searchResult.map((item: any) => {
        const metadata = item.metadata || {};
        return libraryMiddleware.standardizeResource({
          id: item.handle || uuidv4(),
          title: metadata.title || 'Unknown Title',
          description: metadata.description || 'No description available',
          type: 'PDF',
          url: `https://directory.doabooks.org/handle/${item.handle}`,
          thumbnailUrl: '',
          author: metadata.author || 'Unknown Author',
          publishedDate: metadata.dateIssued || new Date().toISOString().split('T')[0],
          categories: metadata.subject || [],
          tags: metadata.subject || [],
          sourceId: item.handle,
          publisher: metadata.publisher,
          language: metadata.language,
          license: metadata.rights
        }, this.name);
      });
    } catch (error) {
      console.error('Error searching DOAB:', error);
      return [];
    }
  }
  
  async getResourceDetails(id: string): Promise<ExternalLibraryResource | null> {
    try {
      const url = `https://directory.doabooks.org/rest/handle/${id}?expand=metadata`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data || !data.metadata) {
        return null;
      }
      
      const metadata = data.metadata;
      
      return libraryMiddleware.standardizeResource({
        id: id,
        title: metadata.title || 'Unknown Title',
        description: metadata.description || 'No description available',
        type: 'PDF',
        url: `https://directory.doabooks.org/handle/${id}`,
        thumbnailUrl: '',
        author: metadata.author || 'Unknown Author',
        publishedDate: metadata.dateIssued || new Date().toISOString().split('T')[0],
        categories: metadata.subject || [],
        tags: metadata.subject || [],
        sourceId: id,
        publisher: metadata.publisher,
        language: metadata.language,
        license: metadata.rights
      }, this.name);
    } catch (error) {
      console.error('Error getting DOAB resource details:', error);
      return null;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://directory.doabooks.org/rest/search?query=test&limit=1');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async syncResources(since?: string): Promise<ExternalLibraryResource[]> {
    try {
      // DOAB doesn't have a changes API, so we'll search for recently added books
      const url = `https://directory.doabooks.org/rest/search?query= import dateIssued:[${since || '*'} TO NOW]&expand=metadata&limit=50`;
      
      const data = await libraryMiddleware.makeRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!data.searchResults || !data.searchResults.searchResult) {
        return [];
      }
      
      return data.searchResults.searchResult.map((item: any) => {
        const metadata = item.metadata || {};
        return libraryMiddleware.standardizeResource({
          id: item.handle || uuidv4(),
          title: metadata.title || 'Unknown Title',
          description: metadata.description || 'No description available',
          type: 'PDF',
          url: `https://directory.doabooks.org/handle/${item.handle}`,
          thumbnailUrl: '',
          author: metadata.author || 'Unknown Author',
          publishedDate: metadata.dateIssued || new Date().toISOString().split('T')[0],
          categories: metadata.subject || [],
          tags: metadata.subject || [],
          sourceId: item.handle,
          publisher: metadata.publisher,
          language: metadata.language,
          license: metadata.rights
        }, this.name);
      });
    } catch (error) {
      console.error('Error syncing DOAB resources:', error);
      return [];
    }
  }
}

// Library API Manager
class LibraryApiManager {
  private providers: LibraryApiProvider[] = [];
  private availableProviders: LibraryApiProvider[] = [];
  
  constructor() {
    // Initialize providers
    this.providers = [
      new NDLIProvider(),
      new OpenLibraryProvider(),
      new ProjectGutenbergProvider(),
      new GoogleBooksProvider(import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''),
      new InternetArchiveProvider(),
      new EuropeanaProvider(import.meta.env.VITE_EUROPEANA_API_KEY || ''),
      new HathiTrustProvider(import.meta.env.VITE_HATHITRUST_API_KEY || ''),
      new WorldDigitalLibraryProvider(import.meta.env.VITE_WORLDDIGITALLIBRARY_API_KEY || ''),
      new DOABProvider(import.meta.env.VITE_DOAB_API_KEY || '')
    ];
  }
  
  async initialize(): Promise<void> {
    // Check which providers are available
    const availabilityChecks = await Promise.all(
      this.providers.map(async provider => {
        const isAvailable = await provider.isAvailable();
        return { provider, isAvailable };
      })
    );
    
    this.availableProviders = availabilityChecks
      .filter(check => check.isAvailable)
      .map(check => check.provider);
    
    console.log(`${this.availableProviders.length} library API providers available:`, 
      this.availableProviders.map(p => p.name).join(', '));
  }
  
  getAvailableProviders(): LibraryApiProvider[] {
    return this.availableProviders;
  }
  
  async searchAllProviders(query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    if (this.availableProviders.length === 0) {
      await this.initialize();
    }
    
    const searchPromises = this.availableProviders.map(provider => 
      provider.searchResources(query, options)
        .catch(error => {
          console.error(`Error searching ${provider.name}:`, error);
          return [];
        })
    );
    
    const results = await Promise.all(searchPromises);
    
    // Flatten and deduplicate results
    const allResults = results.flat();
    
    // Simple deduplication based on title and author
    const uniqueResults: ExternalLibraryResource[] = [];
    const seen = new Set();
    
    for (const result of allResults) {
      const key = `${result.title}|${result.author}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    }
    
    return uniqueResults;
  }
  
  async searchProvider(providerName: string, query: string, options: any = {}): Promise<ExternalLibraryResource[]> {
    if (this.availableProviders.length === 0) {
      await this.initialize();
    }
    
    const provider = this.availableProviders.find(p => p.name === providerName);
    
    if (!provider) {
      throw new Error(`Provider "${providerName}" not found or not available`);
    }
    
    return provider.searchResources(query, options);
  }
  
  async getResourceDetails(providerName: string, id: string): Promise<ExternalLibraryResource | null> {
    if (this.availableProviders.length === 0) {
      await this.initialize();
    }
    
    const provider = this.availableProviders.find(p => p.name === providerName);
    
    if (!provider) {
      throw new Error(`Provider "${providerName}" not found or not available`);
    }
    
    return provider.getResourceDetails(id);
  }
  
  // Convert external resource to internal resource format
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
  
  // Sync resources from all providers
  async syncAllProviders(since?: string): Promise<ExternalLibraryResource[]> {
    if (this.availableProviders.length === 0) {
      await this.initialize();
    }
    
    const syncPromises = this.availableProviders
      .filter(provider => typeof provider.syncResources === 'function')
      .map(provider => 
        provider.syncResources!(since)
          .catch(error => {
            console.error(`Error syncing ${provider.name}:`, error);
            return [];
          })
      );
    
    const results = await Promise.all(syncPromises);
    
    // Flatten and deduplicate results
    const allResults = results.flat();
    
    // Simple deduplication based on title and author
    const uniqueResults: ExternalLibraryResource[] = [];
    const seen = new Set();
    
    for (const result of allResults) {
      const key = `${result.title}|${result.author}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    }
    
    return uniqueResults;
  }
}

// Create and export a singleton instance
export const libraryApiManager = new LibraryApiManager();