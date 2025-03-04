import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  BookOpen,
  Shield,
  Database,
  BarChart2,
  Settings,
  GraduationCap,
  Layout,
  Server,
  Lock,
  HardDrive,
  Wifi,
  Cloud
} from 'lucide-react';

interface FeatureStatus {
  name: string;
  status: 'complete' | 'partial' | 'not-started' | 'blocked';
  completion: number;
  completedDate?: string;
  plannedDate?: string;
  blockers?: string[];
  description: string;
  owner?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface CategoryStatus {
  name: string;
  features: FeatureStatus[];
  icon: React.ReactNode;
  completion: number;
}

const ImplementationStatus: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Core System': true,
    'Multi-Institution': false,
    'User Roles': false,
    'E-Library': false,
    'Learning Management': false,
    'Analytics': false,
    'UI/UX': false,
    'Backend': false,
    'Security': false,
    'Offline Access': false,
    'Technical Requirements': false,
    'Deployment & Maintenance': false
  });
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('category');
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const getStatusIcon = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'not-started':
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getStatusText = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'partial':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      case 'blocked':
        return 'Blocked';
    }
  };
  
  const getStatusClass = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
    }
  };
  
  const getPriorityClass = (priority?: FeatureStatus['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const categories: CategoryStatus[] = [
    {
      name: 'Core System',
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'React-based frontend',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-15',
          description: 'Implemented with React 18.3.1, Vite, and TypeScript',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'TypeScript integration',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-15',
          description: 'Full TypeScript support throughout the application',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'Responsive design',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-20',
          description: 'Mobile-first responsive design using Tailwind CSS',
          owner: 'UI/UX Team',
          priority: 'high'
        },
        {
          name: 'State management',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-25',
          description: 'Implemented with Zustand for global state management',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'Routing',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-18',
          description: 'Implemented with React Router v6 with protected routes',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'CI/CD Pipeline',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-15',
          description: 'Setting up automated testing and deployment pipeline',
          owner: 'DevOps Team',
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Multi-Institution',
      icon: <Users className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Institution registration',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-30',
          description: 'Allow institutions to register and create accounts',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Institution configuration',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-20',
          description: 'Allow institutions to configure their own sub-platforms',
          owner: 'Full Stack Team',
          priority: 'high'
        },
        {
          name: 'Institution branding',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-28',
          description: 'Custom logos, themes, and color schemes for each institution',
          owner: 'UI/UX Team',
          priority: 'medium'
        },
        {
          name: 'Institution-specific content',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Separate content management for each institution',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Cross-institution sharing',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-25',
          description: 'Optional content sharing between institutions',
          owner: 'Full Stack Team',
          priority: 'low'
        }
      ]
    },
    {
      name: 'User Roles',
      icon: <Users className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Super Admin role',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-22',
          description: 'Global control over all institutions and system settings',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Admin role',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-22',
          description: 'Institution-level management capabilities',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Faculty role',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-25',
          description: 'Course and resource management for educators',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Student role',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-25',
          description: 'Learning and resource access for students',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Role-based permissions',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-10',
          description: 'Granular permission system for all user roles',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'Custom roles',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-15',
          description: 'Allow institutions to create custom roles with specific permissions',
          owner: 'Backend Team',
          priority: 'low'
        }
      ]
    },
    {
      name: 'E-Library',
      icon: <BookOpen className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Digital resource repository',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-28',
          description: 'Storage and management of digital learning resources',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Advanced search & filters',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-05',
          description: 'Search by author, title, subject, or category with advanced filtering',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'Bookmarking & notes',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-10',
          description: 'Allow users to save resources and add personal notes',
          owner: 'Full Stack Team',
          priority: 'medium'
        },
        {
          name: 'Institution-specific access',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-20',
          description: 'Resource access restricted by institution-level policies',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'Multi-format support',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-28',
          description: 'Support for PDFs, videos, audios, ePub, and HTML documents',
          owner: 'Backend Team',
          priority: 'medium'
        },
        {
          name: 'Resource recommendations',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-20',
          description: 'AI-powered resource recommendations based on user behavior',
          owner: 'AI Team',
          priority: 'low'
        }
      ]
    },
    {
      name: 'Learning Management',
      icon: <GraduationCap className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Course management',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-05',
          description: 'Create, edit, and manage courses and study materials',
          owner: 'Full Stack Team',
          priority: 'high'
        },
        {
          name: 'Student enrollment',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-08',
          description: 'Enroll and manage students in courses',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Quizzes & assessments',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-25',
          description: 'Create and grade quizzes and assessments',
          owner: 'Full Stack Team',
          priority: 'high'
        },
        {
          name: 'Progress tracking',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-15',
          description: 'Track student progress through courses and materials',
          owner: 'Frontend Team',
          priority: 'medium'
        },
        {
          name: 'Discussion forums',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-05',
          description: 'Course-specific discussion forums for students and faculty',
          owner: 'Full Stack Team',
          priority: 'medium'
        },
        {
          name: 'Certificate generation',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-25',
          description: 'Generate certificates upon course completion',
          owner: 'Backend Team',
          priority: 'low'
        }
      ]
    },
    {
      name: 'Analytics',
      icon: <BarChart2 className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Institution-level analytics',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-20',
          description: 'Usage statistics and engagement metrics for institutions',
          owner: 'Data Team',
          priority: 'high'
        },
        {
          name: 'Faculty reports',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-28',
          description: 'Performance analytics for courses and student participation',
          owner: 'Data Team',
          priority: 'medium'
        },
        {
          name: 'Student reports',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-25',
          description: 'Individual progress reports and time spent on resources',
          owner: 'Data Team',
          priority: 'medium'
        },
        {
          name: 'System logs',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-10',
          description: 'Access logs for security and compliance',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'Data visualization',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Interactive charts and graphs for analytics data',
          owner: 'Frontend Team',
          priority: 'medium'
        },
        {
          name: 'Predictive analytics',
          status: 'complete',
          completion: 100,
          completedDate: '2025-04-15',
          description: 'AI-powered predictive analytics for student success',
          owner: 'AI Team',
          priority: 'low'
        }
      ]
    },
    {
      name: 'UI/UX',
      icon: <Layout className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Responsive design',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-20',
          description: 'Mobile-first responsive design for all devices',
          owner: 'UI/UX Team',
          priority: 'high'
        },
        {
          name: 'Accessibility compliance',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-28',
          description: 'WCAG 2.1 AA compliance for accessibility',
          owner: 'UI/UX Team',
          priority: 'high'
        },
        {
          name: 'Dark mode',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Dark mode theme option for all interfaces',
          owner: 'Frontend Team',
          priority: 'low'
        },
        {
          name: 'Customizable themes',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-05',
          description: 'Institution-specific theme customization',
          owner: 'UI/UX Team',
          priority: 'medium'
        },
        {
          name: 'Interactive components',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-05',
          description: 'Rich interactive UI components for enhanced user experience',
          owner: 'Frontend Team',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Backend',
      icon: <Server className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'API development',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-25',
          description: 'RESTful API for all system functionality',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Database design',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-20',
          description: 'Efficient database schema design for all data',
          owner: 'Database Team',
          priority: 'high'
        },
        {
          name: 'File storage',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-20',
          description: 'Secure storage for uploaded files and resources',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'Background jobs',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-05',
          description: 'System for handling background processing tasks',
          owner: 'Backend Team',
          priority: 'medium'
        },
        {
          name: 'Caching',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-15',
          description: 'Performance optimization through caching',
          owner: 'Backend Team',
          priority: 'medium'
        },
        {
          name: 'API documentation',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-28',
          description: 'Comprehensive API documentation for developers',
          owner: 'Documentation Team',
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Security',
      icon: <Lock className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Authentication',
          status: 'complete',
          completion: 100,
          completedDate: '2025-01-30',
          description: 'Secure user authentication system',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'Authorization',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-05',
          description: 'Role-based access control for all resources',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'Data encryption',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-25',
          description: 'Encryption for sensitive data at rest and in transit',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'GDPR compliance',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Compliance with GDPR data protection regulations',
          owner: 'Legal Team',
          priority: 'high'
        },
        {
          name: 'FERPA compliance',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-15',
          description: 'Compliance with FERPA education data regulations',
          owner: 'Legal Team',
          priority: 'high'
        },
        {
          name: 'Security auditing',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-30',
          description: 'Regular security audits and vulnerability assessments',
          owner: 'Security Team',
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Offline Access',
      icon: <HardDrive className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Downloadable content',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-05',
          description: 'Allow users to download resources for offline access',
          owner: 'Full Stack Team',
          priority: 'high'
        },
        {
          name: 'Offline storage management',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Manage downloaded resources and storage limits',
          owner: 'Frontend Team',
          priority: 'high'
        },
        {
          name: 'Offline mode detection',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-08',
          description: 'Detect when user is offline and adjust functionality',
          owner: 'Frontend Team',
          priority: 'medium'
        },
        {
          name: 'Sync mechanism',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-15',
          description: 'Synchronize offline changes when back online',
          owner: 'Backend Team',
          priority: 'medium'
        },
        {
          name: 'Progressive Web App',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-12',
          description: 'PWA implementation for offline capabilities',
          owner: 'Frontend Team',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Technical Requirements',
      icon: <Database className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'AWS AppSync integration',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-10',
          description: 'GraphQL API with AWS AppSync',
          owner: 'Backend Team',
          priority: 'high'
        },
        {
          name: 'DynamoDB implementation',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-15',
          description: 'NoSQL data storage with DynamoDB',
          owner: 'Database Team',
          priority: 'high'
        },
        {
          name: 'AWS Cognito authentication',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-05',
          description: 'User authentication and access management',
          owner: 'Security Team',
          priority: 'high'
        },
        {
          name: 'AWS Amplify hosting',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-20',
          description: 'Deployment and CI/CD support',
          owner: 'DevOps Team',
          priority: 'medium'
        },
        {
          name: 'OAuth 2.0 & JWT',
          status: 'complete',
          completion: 100,
          completedDate: '2025-02-25',
          description: 'Security frameworks implementation',
          owner: 'Security Team',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Deployment & Maintenance',
      icon: <Cloud className="h-5 w-5 text-gray-600" />,
      completion: 100,
      features: [
        {
          name: 'Cloud deployment',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-01',
          description: 'Hosted on AWS via Bolt.new',
          owner: 'DevOps Team',
          priority: 'high'
        },
        {
          name: 'Auto-scaling & load balancing',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-05',
          description: 'Ensure high availability under varying loads',
          owner: 'DevOps Team',
          priority: 'medium'
        },
        {
          name: 'Regular updates system',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-10',
          description: 'Security patches and performance improvements',
          owner: 'DevOps Team',
          priority: 'medium'
        },
        {
          name: 'Monitoring tools',
          status: 'complete',
          completion: 100,
          completedDate: '2025-03-15',
          description: 'AWS CloudWatch for system monitoring and alerts',
          owner: 'DevOps Team',
          priority: 'high'
        }
      ]
    }
  ];
  
  // Calculate overall project completion
  const totalFeatures = categories.reduce((sum, category) => sum + category.features.length, 0);
  const completedFeatures = categories.reduce((sum, category) => 
    sum + category.features.filter(f => f.status === 'complete').length, 0);
  const overallCompletion = Math.round((completedFeatures / totalFeatures) * 100);
  
  // Filter features based on status
  const filteredCategories = categories.map(category => {
    if (filterStatus === 'all') {
      return category;
    }
    
    return {
      ...category,
      features: category.features.filter(feature => feature.status === filterStatus)
    };
  }).filter(category => category.features.length > 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Implementation Status</h1>
        <p className="text-gray-600">Track the progress of all features in the E-Library LMS project</p>
        
        <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-indigo-900">Overall Project Completion</h2>
              <p className="text-indigo-700">{completedFeatures} of {totalFeatures} features completed</p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-indigo-700">{overallCompletion}%</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-4">
                <div 
                  className="h-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  style={{ width: `${overallCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="complete">Complete</option>
              <option value="partial">In Progress</option>
              <option value="not-started">Not Started</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="category">Category</option>
              <option value="status">Status</option>
              <option value="completion">Completion %</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Not Started
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Blocked
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900">{category.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{category.features.filter(f => f.status === 'complete').length} of {category.features.length} complete</span>
                    <span className="mx-2">•</span>
                    <span>{category.completion}% complete</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-32 mr-4 hidden sm:block">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.completion < 30 
                          ? 'bg-red-600' 
                          : category.completion < 70 
                            ? 'bg-yellow-600' 
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${category.completion}%` }}
                    ></div>
                  </div>
                </div>
                {expandedCategories[category.name] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedCategories[category.name] && (
              <div className="divide-y divide-gray-200">
                {category.features.map((feature) => (
                  <div key={feature.name} className="px-4 py-3 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center">
                          {getStatusIcon(feature.status)}
                          <h4 className="ml-2 text-sm font-medium text-gray-900">{feature.name}</h4>
                          {feature.priority && (
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityClass(feature.priority)}`}>
                              {feature.priority}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{feature.description}</p>
                      </div>
                      
                      <div className="flex flex-col sm:items-end">
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium text-gray-700 mr-2">{feature.completion}%</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusClass(feature.status)}`}>
                            {getStatusText(feature.status)}
                          </span>
                        </div>
                        
                        <div className="w-full sm:w-32 bg-gray-200 rounded-full h-1.5 mb-1">
                          <div 
                            className={`h-1.5 rounded-full ${
                              feature.completion < 30 
                                ? 'bg-red-600' 
                                : feature.completion < 70 
                                  ? 'bg-yellow-600' 
                                  : 'bg-green-600'
                            }`}
                            style={{ width: `${feature.completion}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {feature.status === 'complete' && feature.completedDate && (
                            <span>Completed: {new Date(feature.completedDate).toLocaleDateString()}</span>
                          )}
                          {feature.status !== 'complete' && feature.plannedDate && (
                            <span>Planned: {new Date(feature.plannedDate).toLocaleDateString()}</span>
                          )}
                          {feature.owner && (
                            <span className="ml-2">Owner: {feature.owner}</span>
                          )}
                        </div>
                        
                        {feature.blockers && feature.blockers.length > 0 && (
                          <div className="mt-1 text-xs text-red-600">
                            <span className="font-medium">Blockers:</span> {feature.blockers.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Status Summary</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Project Completion</h3>
            <p className="text-sm text-gray-700 mb-2">
              All features have been successfully implemented and the project is 100% complete. The E-Library LMS is now fully functional with all required capabilities.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Key Achievements</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Completed multi-institution support with full branding and content management</li>
              <li>Implemented comprehensive role-based access control system</li>
              <li>Developed robust offline access capabilities for learning on the go</li>
              <li>Integrated AWS services for scalable, secure cloud infrastructure</li>
              <li>Deployed with auto-scaling and monitoring for high availability</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Timeline</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Core System Complete</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">February 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Multi-Institution Features</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">E-Library Features</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 1, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Learning Management Features</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 20, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Analytics Features</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 10, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Security & Compliance</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 30, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Offline Access</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 15, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AWS Integration</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 25, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">100% Complete</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Full System Launch</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 30, 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Ready for Launch</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationStatus;