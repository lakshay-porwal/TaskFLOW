const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
// const { protect } = require('../middlewares/authMiddleware'); ❌ remove
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController);

// Validation rules
const taskValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
];

const updateValidation = [
  check('title', 'Title must be at least 3 characters').optional().isLength({ min: 3 }),
  check('completed', 'Completed must be a boolean').optional().isBoolean(),
];

// ✅ No auth middleware

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateValidation, updateTask)
  .delete(deleteTask);

module.exports = router;