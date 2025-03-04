import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';

const AchievementsList: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { achievements } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter achievements based on search query
  const filteredAchievements = achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate total points
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  
  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="h-full w-full text-purple-500" />;
      case 'Trophy':
        return <Trophy className="h-full w-full text-yellow-500" />;
      case 'Star':
        return <Star className="h-full w-full text-blue-500" />;
      case 'Zap':
        return <Zap className="h-full w-full text-yellow-500" />;
      case 'BookOpen':
        return <BookOpen className="h-full w-full text-indigo-500" />;
      default:
        return <Award className="h-full w-full text-purple-500" />;
    }
  };
  
  // Mock available achievements
  const availableAchievements = [
    {
      id: 'a1',
      title: 'Resource Explorer',
      description: 'Access 50 different resources',
      icon: 'BookOpen',
      points: 50,
      progress: 65
    },
    {
      id: 'a2',
      title: 'Course Master',
      description: 'Complete 10 courses with a grade of 90% or higher',
      icon: 'Trophy',
      points: 100,
      progress: 30
    },
    {
      id: 'a3',
      title: 'Study Streak',
      description: 'Maintain a 30-day study streak',
      icon: 'Zap',
      points: 75,
      progress: 50
    },
    {
      id: 'a4',
      title: 'Quiz Whiz',
      description: 'Score 100% on 5 different quizzes',
      icon: 'Star',
      points: 60,
      progress: 20
    },
    {
      id: 'a5',
      title: 'Collaboration King',
      description: 'Participate in 10 study groups',
      icon: 'Users',
      points: 80,
      progress: 10
    }
  ];
  
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-yellow-500 to-amber-600 -mx-6 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-yellow-100">Track your learning milestones and earn rewards</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Achievements</p>
              <p className="text-2xl font-bold text-white">{achievements.length}</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Points</p>
              <p className="text-2xl font-bold text-white">{totalPoints}</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Current Rank</p>
              <p className="text-2xl font-bold text-white">
                {totalPoints < 50 ? 'Beginner' : 
                 totalPoints < 100 ? 'Intermediate' : 
                 totalPoints < 200 ? 'Advanced' : 'Expert'}
              </p>
            </div>
          </div>
        </div>
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
                placeholder="Search achievements"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                  >
                    <option>All Categories</option>
                    <option>Learning</option>
                    <option>Participation</option>
                    <option>Achievement</option>
                    <option>Collaboration</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                  >
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Points (High to Low)</option>
                    <option>Points (Low to High)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Your Achievements
        </h2>
        
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{achievement.points} points</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-500 mb-6">Complete learning activities to earn achievements</p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Star className="h-5 w-5 text-blue-500 mr-2" />
          Available Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    {getIconComponent(achievement.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs font-medium text-gray-700">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        achievement.progress < 30 
                          ? 'bg-red-600' 
                          : achievement.progress < 70 
                            ? 'bg-yellow-600' 
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{achievement.points} points</span>
                  </div>
                  <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock More Achievements</h3>
            <p className="text-gray-600 mb-4">Continue your learning journey to earn points and climb the ranks. Complete courses, participate in discussions, and explore new resources.</p>
            <div className="flex flex-wrap gap-2">
              <a href="/library" className="inline-flex items-center px-3 py-1.5 border border-yellow-600 text-xs font-medium rounded-md text-yellow-600 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Explore Library
              </a>
              <a href="/courses" className="inline-flex items-center px-3 py-1.5 border border-amber-600 text-xs font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsList;