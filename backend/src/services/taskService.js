const { db } = require('../config/firebase');

const collectionName = 'tasks';

// Get all tasks for a specific user, ordered by creation date
const getAllTasks = async (userId) => {
  const snapshot = await db.collection(collectionName)
    .where('userId', '==', userId)
    .get();
  
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

// Get single task (ensuring user owns it)
const getTaskById = async (id, userId) => {
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  if (data.userId !== userId) return null;

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
  };
};

// Create a new task tied to a user
const createTask = async (taskData, userId) => {
  const newTask = {
    title: taskData.title,
    description: taskData.description || '',
    completed: false,
    userId, // Tie task to user
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await db.collection(collectionName).add(newTask);
  return { id: docRef.id, ...newTask };
};

// Update an existing task (if owned by user)
const updateTask = async (id, updateData, userId) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return null;
  if (doc.data().userId !== userId) return null;

  const updatedTask = {
    ...updateData,
    updatedAt: new Date()
  };

  await docRef.update(updatedTask);
  
  return { id, ...(doc.data()), ...updatedTask };
};

// Delete a task (if owned by user)
const deleteTask = async (id, userId) => {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return null;
  if (doc.data().userId !== userId) return null;

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
