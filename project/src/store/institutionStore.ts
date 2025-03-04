import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Institution } from '../types';

interface InstitutionState {
  institutions: Institution[];
  
  // Institution actions
  addInstitution: (institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInstitution: (id: string, updates: Partial<Omit<Institution, 'id' | 'createdAt'>>) => void;
  deleteInstitution: (id: string) => void;
  toggleInstitutionStatus: (id: string) => void;
  getInstitution: (id: string) => Institution | undefined;
}

// Mock data - would be replaced with actual API calls
const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'University of Technology',
    logo: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1129&q=80',
    primaryColor: '#4F46E5',
    secondaryColor: '#818CF8',
    domain: 'uot.edu',
    active: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    description: 'A leading institution in technology education and research.',
    address: '123 University Ave, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@uot.edu',
    website: 'https://www.uot.edu',
    foundedYear: 1985
  },
  {
    id: '2',
    name: 'City College',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    primaryColor: '#059669',
    secondaryColor: '#34D399',
    domain: 'citycollege.edu',
    active: true,
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
    description: 'Urban education for the modern world.',
    address: '456 College St, Metro City, MC 67890',
    phone: '+1 (555) 234-5678',
    email: 'info@citycollege.edu',
    website: 'https://www.citycollege.edu',
    foundedYear: 1992
  },
  {
    id: '3',
    name: 'Global Institute of Science',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1186&q=80',
    primaryColor: '#D97706',
    secondaryColor: '#FBBF24',
    domain: 'gis.edu',
    active: false,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    description: 'Advancing scientific knowledge through global collaboration.',
    address: '789 Science Blvd, Research Park, RP 54321',
    phone: '+1 (555) 345-6789',
    email: 'info@gis.edu',
    website: 'https://www.gis.edu',
    foundedYear: 2005
  },
  {
    id: '4',
    name: 'Metropolitan University',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    primaryColor: '#BE185D',
    secondaryColor: '#EC4899',
    domain: 'metrou.edu',
    active: true,
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-04-05T00:00:00Z',
    description: 'Preparing students for success in a metropolitan environment.',
    address: '101 University Circle, Capital City, CC 10101',
    phone: '+1 (555) 456-7890',
    email: 'info@metrou.edu',
    website: 'https://www.metrou.edu',
    foundedYear: 1978
  }
];

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set, get) => ({
      institutions: mockInstitutions,
      
      addInstitution: (institution) => set((state) => {
        const newInstitution: Institution = {
          id: uuidv4(),
          ...institution,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { institutions: [...state.institutions, newInstitution] };
      }),
      
      updateInstitution: (id, updates) => set((state) => {
        const updatedInstitutions = state.institutions.map(institution => 
          institution.id === id 
            ? { ...institution, ...updates, updatedAt: new Date().toISOString() } 
            : institution
        );
        return { institutions: updatedInstitutions };
      }),
      
      deleteInstitution: (id) => set((state) => ({
        institutions: state.institutions.filter(institution => institution.id !== id)
      })),
      
      toggleInstitutionStatus: (id) => set((state) => {
        const updatedInstitutions = state.institutions.map(institution => 
          institution.id === id 
            ? { 
                ...institution, 
                active: !institution.active,
                updatedAt: new Date().toISOString()
              } 
            : institution
        );
        return { institutions: updatedInstitutions };
      }),
      
      getInstitution: (id) => {
        return get().institutions.find(institution => institution.id === id);
      }
    }),
    {
      name: 'institution-storage'
    }
  )
);