import { PropsWithChildren, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  id: string;
  title: string;
  onAddTask?: (title: string) => void;
}

export function Column({ id, title, children, onAddTask }: PropsWithChildren<ColumnProps>) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [newTitle, setNewTitle] = useState('');
  const handleAdd = () => {
    const t = newTitle.trim();
    if (!t) return;
    onAddTask?.(t);
    setNewTitle('');
  };
  return (
    <div
      ref={setNodeRef}
      className={`bg-slate-800 rounded-lg p-3 w-80 flex-shrink-0 border transition-colors ${
        isOver ? 'border-blue-400' : 'border-transparent'
      }`}
    >
      <h2 className="text-lg font-semibold mb-3 text-white">{title}</h2>
      {children}
      <div className="mt-3 flex items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Новая задача"
          className="flex-1 bg-slate-700 text-white placeholder:text-slate-400 rounded-md px-2 py-2 text-sm border border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}


