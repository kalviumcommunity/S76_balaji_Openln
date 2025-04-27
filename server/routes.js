import express from 'express';
import { createTask } from './controllers/task.js';

export const router = express.Router();

// Task routes
router.post('/tasks', createTask);