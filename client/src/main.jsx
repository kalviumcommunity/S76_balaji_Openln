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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root route with conditional redirect */}
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
    </BrowserRouter>
  </React.StrictMode>
);