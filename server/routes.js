import express from 'express';
import { createTask, updateTask, getTasks } from './controllers/task.js';

export const router = express.Router();

// Task routes
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.get('/tasks', getTasks);