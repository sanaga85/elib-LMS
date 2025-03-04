import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentInstitutionId: string | null;
  login: (user: User) => void;
  logout: () => void;
  setCurrentInstitution: (institutionId: string) => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  switchInstitution: (institutionId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  currentInstitutionId: null,
  
  login: (user: User) => set({ 
    isAuthenticated: true, 
    user,
    currentInstitutionId: user.institutionId 
  }),
  
  logout: () => set({ 
    isAuthenticated: false, 
    user: null,
    currentInstitutionId: null
  }),
  
  setCurrentInstitution: (institutionId: string) => set({ 
    currentInstitutionId: institutionId 
  }),
  
  hasPermission: (requiredRole: UserRole | UserRole[]) => {
    const { user } = get();
    
    if (!user) return false;
    
    if (user.role === 'SUPER_ADMIN') return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  },

  switchInstitution: (institutionId: string) => {
    const { user } = get();
    
    if (!user) return;
    
    // Only SUPER_ADMIN can switch institutions
    if (user.role === 'SUPER_ADMIN') {
      set({ currentInstitutionId: institutionId });
    }
  }
}));