import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { initOfflineStorage } from './services/offline';

// Layout
import Layout from './components/layout/Layout';
import OfflineIndicator from './components/offline/OfflineIndicator';

// Auth Pages
import Login from './pages/auth/Login';

// Main Pages
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import InstitutionsList from './pages/institutions/InstitutionsList';
import InstitutionDetails from './pages/institutions/InstitutionDetails';
import InstitutionRegistration from './pages/institutions/InstitutionRegistration';
import CoursesList from './pages/courses/CoursesList';
import AchievementsList from './pages/achievements/AchievementsList';
import ProgressTracker from './pages/progress/ProgressTracker';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import ImplementationStatus from './components/implementation/ImplementationStatus';
import OfflineSettings from './pages/settings/OfflineSettings';
import APIManagement from './pages/admin/APIManagement';
import ResourceDetails from './pages/ResourceDetails';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Initialize offline storage
  useEffect(() => {
    initOfflineStorage();
  }, []);

  return (
    <Router>
      <OfflineIndicator />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="resources/:id" element={<ResourceDetails />} />
          <Route path="institutions" element={<InstitutionsList />} />
          <Route path="institutions/:id" element={<InstitutionDetails />} />
          <Route path="institutions/register" element={<InstitutionRegistration />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="my-courses" element={<CoursesList />} />
          <Route path="achievements" element={<AchievementsList />} />
          <Route path="progress" element={<ProgressTracker />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="implementation-status" element={<ImplementationStatus />} />
          <Route path="settings/offline" element={<OfflineSettings />} />
          <Route path="admin/api-management" element={<APIManagement />} />
          
          {/* Add more routes here */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;