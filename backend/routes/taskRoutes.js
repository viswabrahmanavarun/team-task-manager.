const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTask);

router.route('/stats')
  .get(protect, getTaskStats);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/project/:projectId')
  .get(protect, getProjectTasks);

module.exports = router;
