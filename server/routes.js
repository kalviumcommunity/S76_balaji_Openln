import express from 'express';
import { protect } from './middleware/authMiddleware.js';
import { signup, login, getUserProfile, logout, updateProfile, googleCallback } from './controllers/auth.js';
import { generateDailyTasks, getTasks, completeTask, getUserProfile as getProfileData, generateTaskContent } from './controllers/taskGenerator.js';
import passport from './config/passport.js';
import Task from './models/task.js'; // Add this import
import User from './models/user.js'; // Import User model

export const router = express.Router();

// Auth routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', protect, getUserProfile);
router.post('/auth/logout', protect, logout);
router.put('/auth/profile', protect, updateProfile);

// Google OAuth routes
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=GoogleAuthFailed` }), 
  googleCallback
);

// Task routes
router.get('/tasks', protect, getTasks);
router.post('/tasks/generate', protect, generateDailyTasks);

// IMPORTANT: Put specific routes before parameterized routes
// Today's tasks route
router.get('/tasks/today', protect, async (req, res) => {
  try {
    // Find tasks created today for this user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = await Task.find({
      userId: req.user.id,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching today\'s tasks'
    });
  }
});

// Complete task route - change to POST to match client-side code
router.post('/tasks/:id/complete', protect, completeTask);

// Individual task route - MUST come after /tasks/today
router.get('/tasks/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching task'
    });
  }
});

// Regenerate task content route
router.post('/tasks/:id/regenerate', protect, async (req, res) => {
  try {
    // Find the task
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Get the user
    const user = await User.findById(req.user.id);
    
    // Generate new content
    const taskContent = await generateTaskContent(user, task.type);
    
    // Update the task
    task.content = taskContent.content;
    if (taskContent.quiz && taskContent.quiz.length > 0) {
      task.quiz = taskContent.quiz;
    }
    
    await task.save();
    
    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Error regenerating task content:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error regenerating task content'
    });
  }
});

// Profile routes
router.get('/profile', protect, getProfileData);