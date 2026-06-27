'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { Card } from '../../types';
import { Trash2, Tag } from 'lucide-react';

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};
const PRIORITY_STYLES_LIGHT: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

interface Props { card: Card; }

export function KanbanCard({ card }: Props) {
  const { theme, deleteCard, setActiveCard, users } = useAppStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const assignee = users.find(u => u.id === card.assignee);
  const pStyle = theme === 'dark' ? PRIORITY_STYLES[card.priority] : PRIORITY_STYLES_LIGHT[card.priority];

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      {...attributes}
      {...listeners}
      onClick={() => setActiveCard(card)}
      className={`group relative rounded-xl p-3.5 cursor-pointer select-none
        border transition-all duration-150
        ${theme === 'dark'
          ? 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/8'
          : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
        }`}
    >
      {/* Priority + Delete */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${pStyle}`}>
          {card.priority}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
          aria-label="Delete card"
          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all
            ${theme === 'dark' ? 'text-gray-500 hover:text-red-400' : 'text-gray-300 hover:text-red-500'}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className={`text-sm font-medium mb-1.5 leading-snug
        ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        {card.title}
      </p>

      {card.description && (
        <p className={`text-xs mb-2.5 line-clamp-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {card.tags.map(tag => (
            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1
              ${theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Assignee */}
      {assignee && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ backgroundColor: assignee.color }}
          >
            {assignee.avatar}
          </div>
          <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {assignee.name.split(' ')[0]}
          </span>
        </div>
      )}
    </motion.div>
  );
}
