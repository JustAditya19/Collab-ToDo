const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const protect = require('../middlewares/auth');

// POST /api/tasks
router.post('/', protect, createTask);

// GET /api/tasks
router.get('/', protect, getAllTasks);

// GET /api/tasks/:id
router.get('/:id', protect, getTaskById);

// Update status of a task (drag & drop like action)
router.put('/status/:id', protect, updateTaskStatus);

// DELETE /api/tasks/:id
router.delete('/:id', protect, deleteTask);

module.exports = router;
