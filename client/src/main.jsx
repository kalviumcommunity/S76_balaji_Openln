import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnboardingGoal from "./pages/OnboardingGoal";
import OnboardingTimeCommitment from './pages/OnboardingTimeCommitment';
import OnboardingLearningStyle from './pages/OnboardingLearningStyle';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding/goal" element={<OnboardingGoal />} />
        <Route path="/onboarding/time-commitment" element={<OnboardingTimeCommitment />} />
        <Route path="/onboarding/learning-style" element={<OnboardingLearningStyle />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
