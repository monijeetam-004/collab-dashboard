'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { Column } from '../../types';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const COL_ACCENT: Record<string, string> = {
  'todo': 'border-t-gray-500',
  'in-progress': 'border-t-amber-500',
  'done': 'border-t-emerald-500',
};

interface Props { column: Column; }

export function KanbanColumn({ column }: Props) {
  const { theme, addCard } = useAppStore();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (!title.trim()) { setAdding(false); return; }
    addCard(column.id, { title: title.trim(), description: '', status: column.id, priority: 'medium', tags: [] });
    setTitle('');
    setAdding(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border-t-2 min-w-[300px] max-w-[300px] transition-all duration-150
        ${COL_ACCENT[column.id]}
        ${theme === 'dark'
          ? `bg-white/[0.03] border border-white/10 ${isOver ? 'ring-2 ring-indigo-500/40' : ''}`
          : `bg-gray-50 border border-gray-200 ${isOver ? 'ring-2 ring-indigo-300' : ''}`
        }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b
        ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {column.title}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
            ${theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => setAdding(true)}
          aria-label={`Add card to ${column.title}`}
          className={`p-1 rounded-lg transition-colors
            ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-[120px]">
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {column.cards.map(card => <KanbanCard key={card.id} card={card} />)}
          </AnimatePresence>
        </SortableContext>

        {/* Add card inline */}
        {adding && (
          <div className={`rounded-xl p-3 border ${theme === 'dark' ? 'bg-white/5 border-white/20' : 'bg-white border-gray-300'}`}>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Card title…"
              className={`w-full bg-transparent text-sm outline-none
                ${theme === 'dark' ? 'text-gray-100 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'}`}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                Add
              </button>
              <button onClick={() => setAdding(false)} className={`text-xs px-2.5 py-1 rounded-lg transition-colors
                ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
