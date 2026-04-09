import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const success = await onAdd(title.trim());
    if (success) {
      setTitle('');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 relative shadow-lg">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full pl-6 pr-16 py-4 rounded-xl border-none outline-none text-slate-700 placeholder-slate-400 glass-panel focus:ring-2 focus:ring-indigo-400 transition-all text-lg"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="absolute right-2 top-2 bottom-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center transform active:scale-95"
      >
        <Plus size={24} />
      </button>
    </form>
  );
};

export default TaskForm;
