import express from 'express';
import { protect } from './middleware/authMiddleware.js';
import { createTask, updateTask, getTasks } from './controllers/task.js';
import { signup, login, getUserProfile, logout, updateProfile } from './controllers/auth.js';

export const router = express.Router();

// Auth routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', protect, getUserProfile);
router.post('/auth/logout', protect, logout);
router.put('/auth/profile', protect, updateProfile);

// Task routes
router.post('/tasks', protect, createTask);
router.put('/tasks/:id', protect, updateTask);
router.get('/tasks', protect, getTasks);