import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  BookOpen,
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { format } from 'date-fns';

const CoursesList: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { courses, enrolledCourses } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter courses based on user role, search query, and status filter
  const filteredCourses = courses.filter(course => {
    // Filter by search query
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    // Filter by user role
    if (hasPermission(['STUDENT'])) {
      // Students can only see courses they're enrolled in
      const isEnrolled = user && enrolledCourses[user.id]?.[course.id];
      return matchesSearch && matchesStatus && isEnrolled;
    } else if (hasPermission(['FACULTY'])) {
      // Faculty can only see courses they teach
      return matchesSearch && matchesStatus && course.facultyId === user?.id;
    } else {
      // Admins and super admins can see all courses
      return matchesSearch && matchesStatus;
    }
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hasPermission(['STUDENT']) ? 'My Courses' : 'Courses'}
          </h1>
          <p className="text-gray-600">
            {hasPermission(['STUDENT']) 
              ? 'Manage your enrolled courses and track your progress' 
              : hasPermission(['FACULTY'])
                ? 'Manage your teaching courses and student progress'
                : 'Manage all courses in the system'
            }
          </p>
        </div>
        
        {hasPermission(['FACULTY', 'ADMIN', 'SUPER_ADMIN']) && (
          <div className="mt-4 sm:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              {hasPermission(['FACULTY']) ? 'Create Course' : 'Add Course'}
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="relative flex-1 mb-4 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses by title or description"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="h-40 overflow-hidden relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-white opacity-75" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${
                    course.status === 'active' ? 'bg-green-500' :
                    course.status === 'upcoming' ? 'bg-blue-500' :
                    course.status === 'completed' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(course.startDate), 'MMM d, yyyy')}
                  </span>
                  
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(course.endDate), 'MMM d, yyyy')}
                  </span>
                  
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Users className="h-3 w-3 mr-1" />
                    {course.enrolledStudents.length} Students
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <a 
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    {hasPermission(['STUDENT']) ? 'Go to Course' : 'Manage Course'}
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </a>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
                    {course.resources.length} Resources
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : hasPermission(['STUDENT'])
                ? 'You are not enrolled in any courses yet'
                : hasPermission(['FACULTY'])
                  ? 'You are not teaching any courses yet'
                  : 'No courses have been created yet'
            }
          </p>
          
          {hasPermission(['STUDENT']) && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Browse Available Courses
            </button>
          )}
          
          {hasPermission(['FACULTY', 'ADMIN', 'SUPER_ADMIN']) && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus className="h-4 w-4 mr-2" />
              {hasPermission(['FACULTY']) ? 'Create Course' : 'Add Course'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesList;