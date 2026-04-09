import { useState, useCallback, useEffect } from 'react';
import { taskApi } from '../api/axios';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await taskApi.getAll();
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      toast.error('Could not load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title) => {
    // Generate a temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const newTask = { id: tempId, title, completed: false, createdAt: new Date().toISOString() };
    
    // Optimistic UI Update
    setTasks(prev => [newTask, ...prev]);
    
    try {
      const res = await taskApi.create({ title });
      // Replace temporary task with actual task from server
      setTasks(prev => prev.map(t => t.id === tempId ? res.data : t));
      toast.success('Task added successfully');
      return true;
    } catch (err) {
      // Rollback on failure
      setTasks(prev => prev.filter(t => t.id !== tempId));
      toast.error(err.response?.data?.message || 'Failed to add task');
      return false;
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    
    try {
      await taskApi.update(id, { completed: !currentStatus });
    } catch (err) {
      // Rollback
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
      toast.error('Failed to update task status');
    }
  };
  
  const updateTaskTitle = async (id, oldTitle, newTitle) => {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
      
      try {
        await taskApi.update(id, { title: newTitle });
        toast.success('Task updated');
      } catch (err) {
        // Rollback
        setTasks(prev => prev.map(t => t.id === id ? { ...t, title: oldTitle } : t));
        toast.error('Failed to update task title');
      }
    };

  const deleteTask = async (id) => {
    // Save task for potential rollback
    const taskToDelete = tasks.find(t => t.id === id);
    
    // Optimistic Update
    setTasks(prev => prev.filter(t => t.id !== id));
    
    try {
      await taskApi.delete(id);
      toast.success('Task deleted');
    } catch (err) {
      // Rollback
      if (taskToDelete) {
        setTasks(prev => [...prev, taskToDelete].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
      toast.error('Failed to delete task');
    }
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTaskStatus,
    updateTaskTitle,
    deleteTask,
    refreshTasks: fetchTasks
  };
};
