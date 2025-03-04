import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseState {
  courses: Course[];
  modules: Module[];
  assignments: Assignment[];
  enrolledCourses: Record<string, boolean>; // userId -> courseId -> boolean
  
  // Course actions
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>) => void;
  deleteCourse: (id: string) => void;
  
  // Module actions
  addModule: (module: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateModule: (id: string, updates: Partial<Omit<Module, 'id' | 'createdAt'>>) => void;
  deleteModule: (id: string) => void;
  
  // Assignment actions
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>) => void;
  deleteAssignment: (id: string) => void;
  
  // Enrollment actions
  enrollStudent: (courseId: string, studentId: string) => void;
  unenrollStudent: (courseId: string, studentId: string) => void;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'A comprehensive introduction to the fundamental concepts of computer science.',
    institutionId: '1',
    facultyId: '3',
    enrolledStudents: ['4'],
    resources: ['1', '2'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    startDate: '2023-02-01T00:00:00Z',
    endDate: '2023-05-30T00:00:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'active'
  },
  {
    id: '2',
    title: 'Advanced Database Systems',
    description: 'An in-depth exploration of database management systems and advanced SQL concepts.',
    institutionId: '1',
    facultyId: '3',
    enrolledStudents: ['4'],
    resources: ['2'],
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z',
    startDate: '2023-02-15T00:00:00Z',
    endDate: '2023-06-15T00:00:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    status: 'active'
  },
  {
    id: '3',
    title: 'Principles of Economics',
    description: 'A study of microeconomics and macroeconomics principles and their applications.',
    institutionId: '1',
    facultyId: '3',
    enrolledStudents: [],
    resources: ['3'],
    createdAt: '2023-01-25T00:00:00Z',
    updatedAt: '2023-01-25T00:00:00Z',
    startDate: '2023-03-01T00:00:00Z',
    endDate: '2023-07-01T00:00:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'upcoming'
  }
];

const mockModules: Module[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts and syntax.',
    order: 1,
    resources: ['1'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    courseId: '1',
    title: 'Data Structures',
    description: 'Explore common data structures and their implementations.',
    order: 2,
    resources: ['2'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '3',
    courseId: '2',
    title: 'SQL Fundamentals',
    description: 'Learn the basics of SQL and relational database concepts.',
    order: 1,
    resources: ['2'],
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z'
  }
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    moduleId: '1',
    title: 'Programming Basics Quiz',
    description: 'A quiz covering the fundamental concepts of programming.',
    dueDate: '2023-02-15T00:00:00Z',
    points: 100,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    courseId: '1',
    moduleId: '2',
    title: 'Data Structures Implementation',
    description: 'Implement common data structures in your chosen programming language.',
    dueDate: '2023-03-01T00:00:00Z',
    points: 150,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '3',
    courseId: '2',
    moduleId: '3',
    title: 'SQL Query Assignment',
    description: 'Write SQL queries to solve database problems.',
    dueDate: '2023-03-15T00:00:00Z',
    points: 100,
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z'
  }
];

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: mockCourses,
      modules: mockModules,
      assignments: mockAssignments,
      enrolledCourses: {
        '4': {
          '1': true,
          '2': true
        }
      },
      
      addCourse: (course) => set((state) => {
        const newCourse: Course = {
          id: uuidv4(),
          ...course,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { courses: [...state.courses, newCourse] };
      }),
      
      updateCourse: (id, updates) => set((state) => {
        const updatedCourses = state.courses.map(course => 
          course.id === id 
            ? { ...course, ...updates, updatedAt: new Date().toISOString() } 
            : course
        );
        return { courses: updatedCourses };
      }),
      
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter(course => course.id !== id),
        modules: state.modules.filter(module => module.courseId !== id),
        assignments: state.assignments.filter(assignment => assignment.courseId !== id)
      })),
      
      addModule: (module) => set((state) => {
        const newModule: Module = {
          id: uuidv4(),
          ...module,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { modules: [...state.modules, newModule] };
      }),
      
      updateModule: (id, updates) => set((state) => {
        const updatedModules = state.modules.map(module => 
          module.id === id 
            ? { ...module, ...updates, updatedAt: new Date().toISOString() } 
            : module
        );
        return { modules: updatedModules };
      }),
      
      deleteModule: (id) => set((state) => ({
        modules: state.modules.filter(module => module.id !== id),
        assignments: state.assignments.filter(assignment => assignment.moduleId !== id)
      })),
      
      addAssignment: (assignment) => set((state) => {
        const newAssignment: Assignment = {
          id: uuidv4(),
          ...assignment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { assignments: [...state.assignments, newAssignment] };
      }),
      
      updateAssignment: (id, updates) => set((state) => {
        const updatedAssignments = state.assignments.map(assignment => 
          assignment.id === id 
            ? { ...assignment, ...updates, updatedAt: new Date().toISOString() } 
            : assignment
        );
        return { assignments: updatedAssignments };
      }),
      
      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(assignment => assignment.id !== id)
      })),
      
      enrollStudent: (courseId, studentId) => set((state) => {
        // Update course's enrolled students
        const updatedCourses = state.courses.map(course => 
          course.id === courseId && !course.enrolledStudents.includes(studentId)
            ? { 
                ...course, 
                enrolledStudents: [...course.enrolledStudents, studentId],
                updatedAt: new Date().toISOString()
              } 
            : course
        );
        
        // Update enrolled courses record
        const studentEnrollments = state.enrolledCourses[studentId] || {};
        
        return { 
          courses: updatedCourses,
          enrolledCourses: {
            ...state.enrolledCourses,
            [studentId]: {
              ...studentEnrollments,
              [courseId]: true
            }
          }
        };
      }),
      
      unenrollStudent: (courseId, studentId) => set((state) => {
        // Update course's enrolled students
        const updatedCourses = state.courses.map(course => 
          course.id === courseId
            ? { 
                ...course, 
                enrolledStudents: course.enrolledStudents.filter(id => id !== studentId),
                updatedAt: new Date().toISOString()
              } 
            : course
        );
        
        // Update enrolled courses record
        const studentEnrollments = { ...state.enrolledCourses[studentId] };
        delete studentEnrollments[courseId];
        
        return { 
          courses: updatedCourses,
          enrolledCourses: {
            ...state.enrolledCourses,
            [studentId]: studentEnrollments
          }
        };
      })
    }),
    {
      name: 'course-storage'
    }
  )
);