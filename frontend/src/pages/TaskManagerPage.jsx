import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { SkeletonTasks, EmptyState, FilterBar } from '../components/Helpers';
import { TerminalSquare, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskManagerPage = () => {
  const { tasks, isLoading, error, addTask, toggleTaskStatus, updateTaskTitle, deleteTask } = useTasks();
  const { user, logout } = useAuth();
  
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'Pending' && task.completed) return false;
      if (filter === 'Completed' && !task.completed) return false;
      if (debouncedSearch && !task.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filter, debouncedSearch]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch(err) {
      toast.error("Failed to logout");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300 blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300 blur-[120px] opacity-30 pointer-events-none" />

      <main className="w-full max-w-3xl mx-auto px-4 py-12 relative z-10 flex-1 flex flex-col">
        <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
                <TerminalSquare size={28} />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">TaskFlow</h1>
            </div>
            <p className="text-slate-500 font-medium">Welcome back, {user?.email?.split('@')[0]}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/40 min-w-[150px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600">Progress</span>
                <span className="text-sm font-bold text-indigo-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-3 bg-white/60 hover:bg-white text-slate-600 hover:text-red-600 rounded-2xl shadow-sm border border-white/40 transition-all flex flex-col items-center justify-center h-full gap-1"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <TaskForm onAdd={addTask} />
        <FilterBar filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1">
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <SkeletonTasks />
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-1 pb-16">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTaskStatus} 
                  onUpdateTitle={updateTaskTitle}
                  onDelete={deleteTask} 
                />
              ))}
            </div>
          ) : (
            <EmptyState message={searchQuery ? "No tasks match your search." : "You have no tasks yet. Add one above!"} />
          )}
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-slate-400 text-sm mt-auto relative z-10 transition-opacity">
        Task Manager App • Built for Technical Assignment
      </footer>
    </div>
  );
}

export default TaskManagerPage;
