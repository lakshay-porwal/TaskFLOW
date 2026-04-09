import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SkeletonTasks = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-panel animate-pulse bg-white/40">
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ message = "You have no tasks yet. Add one above!" }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center fade-in">
    <div className="bg-indigo-50 p-4 rounded-full mb-4">
      <CheckCircle2 size={48} className="text-indigo-300" />
    </div>
    <h3 className="text-xl font-medium text-slate-600 mb-2">All caught up!</h3>
    <p className="text-slate-400">{message}</p>
  </div>
);

export const FilterBar = ({ filter, setFilter, searchQuery, setSearchQuery }) => {
  const filters = ['All', 'Pending', 'Completed'];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex gap-2 bg-white/50 p-1 rounded-lg glass-panel w-full sm:w-auto">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none
              ${filter === f 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-slate-500 hover:text-slate-700'}`}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-sm bg-white/50 glass-panel outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder-slate-400"
        />
      </div>
    </div>
  );
};
