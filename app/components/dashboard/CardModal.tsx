'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { X, Flag, User } from 'lucide-react';
import { CardPriority, CardStatus } from '../../types';

const PRIORITIES: CardPriority[] = ['low', 'medium', 'high'];
const STATUSES: CardStatus[] = ['todo', 'in-progress', 'done'];

export function CardModal() {
  const { activeCard, setActiveCard, updateCard, theme, users } = useAppStore();

  return (
    <AnimatePresence>
      {activeCard && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCard(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50
              rounded-2xl shadow-2xl border p-6
              ${theme === 'dark' ? 'bg-[#161b27] border-white/15' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <input
                className={`text-lg font-semibold bg-transparent outline-none flex-1 mr-4
                  ${theme === 'dark' ? 'text-white placeholder-gray-600' : 'text-gray-900'}`}
                value={activeCard.title}
                onChange={e => updateCard(activeCard.id, { title: e.target.value })}
              />
              <button
                onClick={() => setActiveCard(null)}
                aria-label="Close"
                className={`p-1.5 rounded-lg transition-colors
                  ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Add description…"
              className={`w-full bg-transparent text-sm resize-none outline-none rounded-lg p-3 mb-4 border
                ${theme === 'dark'
                  ? 'text-gray-300 placeholder-gray-600 border-white/10 focus:border-indigo-500/50'
                  : 'text-gray-600 placeholder-gray-400 border-gray-200 focus:border-indigo-300'
                } transition-colors`}
              value={activeCard.description}
              onChange={e => updateCard(activeCard.id, { description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className={`text-xs font-medium flex items-center gap-1.5 mb-2
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Flag className="w-3.5 h-3.5" /> Priority
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => updateCard(activeCard.id, { priority: p })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                        ${activeCard.priority === p
                          ? 'bg-indigo-500 text-white'
                          : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={`text-xs font-medium mb-2 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status
                </label>
                <select
                  value={activeCard.status}
                  onChange={e => updateCard(activeCard.id, { status: e.target.value as CardStatus })}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs outline-none border
                    ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-gray-200'
                      : 'bg-white border-gray-200 text-gray-700'
                    }`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Assignee */}
              <div className="col-span-2">
                <label className={`text-xs font-medium flex items-center gap-1.5 mb-2
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <User className="w-3.5 h-3.5" /> Assignee
                </label>
                <div className="flex gap-2 flex-wrap">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => updateCard(activeCard.id, { assignee: u.id })}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all
                        ${activeCard.assignee === u.id
                          ? 'ring-2 ring-indigo-500'
                          : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: u.color }}>
                        {u.avatar}
                      </div>
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {u.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
