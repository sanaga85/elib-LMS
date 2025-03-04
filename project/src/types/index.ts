export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  foundedYear?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'VIDEO' | 'AUDIO' | 'EPUB' | 'HTML' | 'OTHER';
  url: string;
  thumbnailUrl: string;
  author: string;
  publishedDate: string;
  categories: string[];
  tags: string[];
  institutionId: string | null; // null means available to all institutions
  rating: number;
  bookmarks: number;
  featured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
  offlineAvailable?: boolean;
  fileSize?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  institutionId: string;
  facultyId: string;
  enrolledStudents: string[];
  resources: string[];
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  thumbnail?: string;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
}

export interface Bookmark {
  id: string;
  userId: string;
  resourceId: string;
  notes: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  completedAt: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalResources: number;
  totalCourses: number;
  resourcesAccessed: number;
  activeUsers: number;
  popularResources: {
    resourceId: string;
    title: string;
    accessCount: number;
  }[];
}

export interface OfflineStorageStats {
  totalItems: number;
  totalStorageUsed: number;
  maxStorageSize: number;
  lastSyncTime: string | null;
}