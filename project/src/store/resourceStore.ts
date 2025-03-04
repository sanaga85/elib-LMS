import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ResourceType = 'PDF' | 'VIDEO' | 'AUDIO' | 'EPUB' | 'HTML' | 'OTHER';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  thumbnailUrl: string;
  author: string;
  publishedDate: string;
  categories: string[];
  tags: string[];
  institutionId: string | null;
  rating: number;
  bookmarks: number;
  featured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceState {
  resources: Resource[];
  bookmarkedResources: Record<string, boolean>;
  recentlyAccessed: string[];
  
  // Resource actions
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResource: (id: string, updates: Partial<Omit<Resource, 'id' | 'createdAt'>>) => void;
  deleteResource: (id: string) => void;
  
  // Bookmark actions
  toggleBookmark: (id: string) => void;
  
  // Access tracking
  accessResource: (id: string) => void;
}

// Mock data
const mockResources = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'A comprehensive guide to the basics of machine learning algorithms and applications.',
    type: 'PDF' as ResourceType,
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
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Advanced Database Systems',
    description: 'Explore the principles and practices of modern database management systems.',
    type: 'VIDEO' as ResourceType,
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
    updatedAt: '2023-02-20T00:00:00Z'
  },
  {
    id: '3',
    title: 'Principles of Economics',
    description: 'An introduction to microeconomics and macroeconomics concepts.',
    type: 'PDF' as ResourceType,
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
    updatedAt: '2023-03-10T00:00:00Z'
  },
  {
    id: '4',
    title: 'History of Modern Art',
    description: 'A journey through the evolution of art from the 19th century to present day.',
    type: 'PDF' as ResourceType,
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
    updatedAt: '2023-04-05T00:00:00Z'
  },
  {
    id: '5',
    title: 'Introduction to Quantum Physics',
    description: 'Understand the fundamental principles of quantum mechanics and its applications.',
    type: 'VIDEO' as ResourceType,
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
    updatedAt: '2023-05-12T00:00:00Z'
  },
  {
    id: '6',
    title: 'Organic Chemistry Fundamentals',
    description: 'Learn about organic compounds, reactions, and laboratory techniques.',
    type: 'AUDIO' as ResourceType,
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
    updatedAt: '2023-06-18T00:00:00Z'
  }
];

export const useResourceStore = create<ResourceState>()(
  persist(
    (set, get) => ({
      resources: mockResources,
      bookmarkedResources: {},
      recentlyAccessed: [],
      
      addResource: (resource) => set((state) => {
        const newResource: Resource = {
          id: uuidv4(),
          ...resource,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { resources: [...state.resources, newResource] };
      }),
      
      updateResource: (id, updates) => set((state) => {
        const updatedResources = state.resources.map(resource => 
          resource.id === id 
            ? { ...resource, ...updates, updatedAt: new Date().toISOString() } 
            : resource
        );
        return { resources: updatedResources };
      }),
      
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter(resource => resource.id !== id)
      })),
      
      toggleBookmark: (id) => set((state) => {
        const isBookmarked = !!state.bookmarkedResources[id];
        
        // Update bookmark count in the resource
        const updatedResources = state.resources.map(resource => 
          resource.id === id 
            ? { 
                ...resource, 
                bookmarks: isBookmarked ? resource.bookmarks - 1 : resource.bookmarks + 1,
                updatedAt: new Date().toISOString()
              } 
            : resource
        );
        
        return { 
          bookmarkedResources: { 
            ...state.bookmarkedResources, 
            [id]: !isBookmarked 
          },
          resources: updatedResources
        };
      }),
      
      accessResource: (id) => set((state) => {
        // Add to recently accessed, keeping only the 10 most recent
        const recentlyAccessed = [
          id,
          ...state.recentlyAccessed.filter(resourceId => resourceId !== id)
        ].slice(0, 10);
        
        return { recentlyAccessed };
      })
    }),
    {
      name: 'resource-storage'
    }
  )
);