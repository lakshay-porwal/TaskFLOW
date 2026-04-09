const { db } = require('../config/firebase');

const collectionName = 'tasks';

// Get all tasks, ordered by creation date
const getAllTasks = async () => {
  const snapshot = await db.collection(collectionName).get();
  
  const tasks = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    tasks.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    });
  });

  // Sort tasks in-memory by createdAt descending
  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get single task
const getTaskById = async (id) => {
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
  };
};

// Create a new task
const createTask = async (taskData) => {
  const newTask = {
    title: taskData.title,
    description: taskData.description || '',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await db.collection(collectionName).add(newTask);
  return { id: docRef.id, ...newTask };
};

// Update an existing task
const updateTask = async (id, updateData) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return null;

  const updatedTask = {
    ...updateData,
    updatedAt: new Date()
  };

  await docRef.update(updatedTask);
  
  return { id, ...(doc.data()), ...updatedTask };
};

// Delete a task
const deleteTask = async (id) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return null;

  await docRef.delete();
  return id;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
