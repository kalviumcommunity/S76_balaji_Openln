import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnboardingGoal from "./pages/OnboardingGoal";
import OnboardingTimeCommitment from './pages/OnboardingTimeCommitment';
import OnboardingLearningStyle from './pages/OnboardingLearningStyle';
import OnboardingQuiz from './pages/OnboardingQuiz';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';  
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Root route handler component
const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <Landing />;
};

// Onboarding route protection
const ProtectedOnboarding = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Modified Root component to check for cookies
const Root = () => {
  useEffect(() => {
    // Check for temporary auth token cookie
    const tempToken = getCookie('tempAuthToken');
    if (tempToken) {
      // Save to localStorage and remove cookie
      localStorage.setItem('token', tempToken);
      document.cookie = 'tempAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected onboarding routes */}
      <Route path="/onboarding/goal" element={
        <ProtectedOnboarding>
          <OnboardingGoal />
        </ProtectedOnboarding>
      } />
      <Route path="/onboarding/time-commitment" element={
        <ProtectedOnboarding>
          <OnboardingTimeCommitment />
        </ProtectedOnboarding>
      } />
      <Route path="/onboarding/learning-style" element={
        <ProtectedOnboarding>
          <OnboardingLearningStyle />
        </ProtectedOnboarding>
      } />
      <Route path="/onboarding/quiz" element={
        <ProtectedOnboarding>
          <OnboardingQuiz />
        </ProtectedOnboarding>
      } />
      
      {/* Protected app routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/task/:id" element={
        <ProtectedRoute>
          <TaskDetail />
        </ProtectedRoute>
      } />
      {/* Add profile route */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);