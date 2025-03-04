import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  resourceId?: string;
  courseId?: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

interface ProgressState {
  goals: Goal[];
  studySessions: StudySession[];
  achievements: Achievement[];
  studyStreak: {
    current: number;
    longest: number;
    lastStudyDate: string | null;
    thisWeek: boolean[];
  };
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
  deleteGoal: (id: string) => void;
  
  // Study session actions
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  updateStudyStreak: () => void;
  
  // Achievement actions
  addAchievement: (achievement: Omit<Achievement, 'id' | 'earnedAt'>) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      goals: [
        {
          id: '1',
          title: 'Complete Machine Learning Course',
          description: 'Finish all modules and assignments',
          progress: 65,
          target: 100,
          createdAt: '2023-09-15T00:00:00Z',
          updatedAt: '2023-10-10T00:00:00Z'
        },
        {
          id: '2',
          title: 'Read 10 Academic Papers',
          description: 'Focus on AI and machine learning topics',
          progress: 30,
          target: 100,
          createdAt: '2023-09-20T00:00:00Z',
          updatedAt: '2023-10-05T00:00:00Z'
        },
        {
          id: '3',
          title: 'Practice Python Daily',
          description: 'At least 30 minutes of coding practice',
          progress: 80,
          target: 100,
          createdAt: '2023-09-10T00:00:00Z',
          updatedAt: '2023-10-12T00:00:00Z'
        }
      ],
      studySessions: [],
      achievements: [
        {
          id: '1',
          title: 'Quick Learner',
          description: 'Completed 5 courses in a month',
          icon: 'Zap',
          earnedAt: '2023-09-30T00:00:00Z',
          points: 50
        },
        {
          id: '2',
          title: 'Bookworm',
          description: 'Read 20 resources',
          icon: 'BookOpen',
          earnedAt: '2023-10-05T00:00:00Z',
          points: 30
        },
        {
          id: '3',
          title: 'Perfect Score',
          description: 'Scored 100% on a quiz',
          icon: 'Award',
          earnedAt: '2023-10-10T00:00:00Z',
          points: 40
        }
      ],
      studyStreak: {
        current: 5,
        longest: 14,
        lastStudyDate: new Date().toISOString().split('T')[0],
        thisWeek: [true, true, true, true, true, false, false]
      },
      
      addGoal: (goal) => set((state) => {
        const newGoal: Goal = {
          id: uuidv4(),
          ...goal,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { goals: [...state.goals, newGoal] };
      }),
      
      updateGoal: (id, updates) => set((state) => {
        const updatedGoals = state.goals.map(goal => 
          goal.id === id 
            ? { 
                ...goal, 
                ...updates, 
                updatedAt: new Date().toISOString(),
                completedAt: updates.progress >= goal.target 
                  ? updates.completedAt || new Date().toISOString() 
                  : undefined
              } 
            : goal
        );
        return { goals: updatedGoals };
      }),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(goal => goal.id !== id)
      })),
      
      addStudySession: (session) => set((state) => {
        const newSession: StudySession = {
          id: uuidv4(),
          ...session
        };
        
        // Update study streak
        const today = new Date().toISOString().split('T')[0];
        const lastStudyDate = state.studyStreak.lastStudyDate;
        
        let current = state.studyStreak.current;
        let longest = state.studyStreak.longest;
        
        // If study date is today and we haven't recorded it yet
        if (session.date.startsWith(today) && lastStudyDate !== today) {
          // If last study was yesterday, increment streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastStudyDate === yesterdayStr) {
            current += 1;
            if (current > longest) {
              longest = current;
            }
          } else if (lastStudyDate !== today) {
            // Reset streak if last study wasn't yesterday or today
            current = 1;
          }
        }
        
        // Update thisWeek array
        const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
        const thisWeek = [...state.studyStreak.thisWeek];
        if (session.date.startsWith(today)) {
          thisWeek[dayOfWeek] = true;
        }
        
        return { 
          studySessions: [...state.studySessions, newSession],
          studyStreak: {
            current,
            longest,
            lastStudyDate: today,
            thisWeek
          }
        };
      }),
      
      updateStudyStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const lastStudyDate = state.studyStreak.lastStudyDate;
        
        // If already updated today, do nothing
        if (lastStudyDate === today) {
          return state;
        }
        
        // Check if streak is broken (more than one day since last study)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let current = state.studyStreak.current;
        
        if (lastStudyDate !== yesterdayStr) {
          current = 0;
        }
        
        return {
          studyStreak: {
            ...state.studyStreak,
            current
          }
        };
      }),
      
      addAchievement: (achievement) => set((state) => {
        const newAchievement: Achievement = {
          id: uuidv4(),
          ...achievement,
          earnedAt: new Date().toISOString()
        };
        return { achievements: [...state.achievements, newAchievement] };
      })
    }),
    {
      name: 'progress-storage'
    }
  )
);