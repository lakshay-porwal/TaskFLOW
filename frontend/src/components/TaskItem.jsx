import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TaskItem = ({ task, onToggle, onDelete, onUpdateTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdateTitle(task.id, task.title, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "group flex items-center justify-between p-4 my-2 rounded-xl transition-all duration-300",
      "glass-panel hover:bg-white/90 hover:shadow-2xl hover:-translate-y-0.5",
      task.completed && "opacity-75 bg-slate-50/50"
    )}>
      <div className="flex items-center gap-4 w-full">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, task.completed)}
            className="peer sr-only"
          />
          <div className="w-6 h-6 border-2 border-indigo-400 rounded-full peer-checked:bg-indigo-500 peer-checked:border-indigo-500 flex items-center justify-center transition-colors">
            {task.completed && <Check size={14} className="text-white" />}
          </div>
        </label>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 bg-white border border-indigo-200 outline-none px-3 py-1 rounded-md text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              autoFocus
            />
            <button type="submit" className="p-1.5 text-green-500 hover:bg-green-50 rounded-md transition-colors"><Check size={18} /></button>
            <button type="button" onClick={handleCancel} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><X size={18} /></button>
          </form>
        ) : (
          <span className={cn(
            "flex-1 text-slate-700 transition-all duration-300",
            task.completed && "line-through text-slate-400"
          )}>
            {task.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Task"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
