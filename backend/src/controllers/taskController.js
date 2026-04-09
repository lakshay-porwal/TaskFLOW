const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.user);
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const task = await taskService.createTask(req.body, req.user);
    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user);
    
    if (!updatedTask) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const deletedId = await taskService.deleteTask(req.params.id, req.user);
    
    if (!deletedId) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({ status: 'success', message: 'Task removed', data: { id: deletedId } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
