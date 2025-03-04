import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Zap,
  BarChart2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore, Goal } from '../../store/progressStore';
import { format } from 'date-fns';

const ProgressTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { goals, studyStreak, addGoal, updateGoal, deleteGoal } = useProgressStore();
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 100
  });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      ...newGoal,
      progress: 0
    });
    setNewGoal({
      title: '',
      description: '',
      target: 100
    });
    setShowAddGoalForm(false);
  };
  
  const handleUpdateGoal = (id: string, progress: number) => {
    updateGoal(id, { progress });
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      target: goal.target
    });
    setShowAddGoalForm(true);
  };
  
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoalId) {
      updateGoal(editingGoalId, {
        title: newGoal.title,
        description: newGoal.description,
        target: newGoal.target
      });
      setEditingGoalId(null);
      setNewGoal({
        title: '',
        description: '',
        target: 100
      });
      setShowAddGoalForm(false);
    }
  };
  
  // Mock study sessions data
  const studySessions = [
    {
      id: '1',
      date: '2023-10-15',
      duration: 120,
      resourceTitle: 'Introduction to Machine Learning',
      courseTitle: 'Computer Science 101'
    },
    {
      id: '2',
      date: '2023-10-14',
      duration: 90,
      resourceTitle: 'Advanced Database Systems',
      courseTitle: 'Database Management'
    },
    {
      id: '3',
      date: '2023-10-13',
      duration: 60,
      resourceTitle: 'Principles of Economics',
      courseTitle: 'Economics 101'
    },
    {
      id: '4',
      date: '2023-10-12',
      duration: 45,
      resourceTitle: 'History of Modern Art',
      courseTitle: 'Art History'
    },
    {
      id: '5',
      date: '2023-10-11',
      duration: 75,
      resourceTitle: 'Introduction to Quantum Physics',
      courseTitle: 'Physics 201'
    }
  ];
  
  // Calculate total study time
  const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);
  
  // Format study time
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Progress Tracker</h1>
        <p className="text-indigo-100">Monitor your learning journey and set goals</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Active Goals</p>
              <p className="text-2xl font-bold text-white">{goals.filter(g => g.progress < g.target).length}</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Study Time</p>
              <p className="text-2xl font-bold text-white">{formatStudyTime(totalStudyTime)}</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center">
            <div className="rounded-full bg-white/30 p-3 mr-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Study Streak</p>
              <p className="text-2xl font-bold text-white">{studyStreak.current} days</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="mr-2 text-indigo-600" size={18} />
                Learning Goals
              </h2>
              <button 
                onClick={() => {
                  setEditingGoalId(null);
                  setNewGoal({
                    title: '',
                    description: '',
                    target: 100
                  });
                  setShowAddGoalForm(!showAddGoalForm);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </button>
            </div>
            <div className="p-6">
              {showAddGoalForm && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    {editingGoalId ? 'Edit Goal' : 'Add New Goal'}
                  </h3>
                  <form onSubmit={editingGoalId ? handleSaveEdit : handleAddGoal}>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter goal title"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter goal description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Value (%)
                      </label>
                      <input
                        type="number"
                        id="target"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddGoalForm(false);
                          setEditingGoalId(null);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {editingGoalId ? 'Save Changes' : 'Add Goal'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-md font-medium text-gray-900">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditGoal(goal)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className={`h-2.5 rounded-full ${
                            goal.progress < 30 
                              ? 'bg-red-600' 
                              : goal.progress < 70 
                                ? 'bg-yellow-600' 
                                : 'bg-green-600'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Created: {new Date(goal.createdAt).toLocaleDateString()}
                        </div>
                        
                        {goal.progress < goal.target ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleUpdateGoal(goal.id, Math.min(goal.progress + 10, goal.target))}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Plus size={12} className="mr-1" />
                              Update Progress
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100">
                            <CheckCircle size={12} className="mr-1" />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">No goals yet</p>
                  <p className="text-gray-500 text-sm mb-4">Create your first learning goal to track your progress</p>
                  <button 
                    onClick={() => setShowAddGoalForm(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="mr-2 text-purple-600" size={18} />
                Study Streak
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 text-purple-800 rounded-lg px-4 py-2 flex items-center mr-4">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  <div>
                    <div className="text-xs text-purple-600">Current Streak</div>
                    <div className="text-xl font-bold">{studyStreak.current} days</div>
                  </div>
                </div>
                <div className="bg-indigo-100 text-indigo-800 rounded-lg px-4 py-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  <div>
                    <div className="text-xs text-indigo-600">Longest Streak</div>
                    <div className="text-xl font-bold">{studyStreak.longest} days</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-xs text-center flex-1">{day}</div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                {studyStreak.thisWeek.map((active, index) => (
                  <div 
                    key={index} 
                    className={`h-8 rounded-md flex-1 flex items-center justify-center ${
                      active 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                        : index >= new Date().getDay() 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {active ? <CheckCircle size={16} /> : null}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Log Study Session
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 text-blue-600" size={18} />
                Recent Study Sessions
              </h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {studySessions.map((session) => (
                  <li key={session.id} className="py-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{format(new Date(session.date), 'MMM d, yyyy')}</span>
                      <span className="text-sm text-gray-500">{formatStudyTime(session.duration)}</span>
                    </div>
                    <p className="text-xs text-gray-600">{session.resourceTitle}</p>
                    <p className="text-xs text-gray-500">{session.courseTitle}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View All Sessions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart2 className="mr-2 text-indigo-600" size={18} />
            Learning Analytics
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Study Time Distribution</h3>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Study time chart will be displayed here</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Resource Types</h3>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Resource types chart will be displayed here</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-3">Goal Completion</h3>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Goal completion chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Smart Learning Goals</h3>
            <p className="text-gray-600 mb-4">Effective goals are Specific, Measurable, Achievable, Relevant, and Time-bound. Break down large goals into smaller, manageable tasks for better progress tracking.</p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Goal Setting Tips
              </a>
              <a href="#" className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-xs font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Learning Strategies
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;