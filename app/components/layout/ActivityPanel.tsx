'use client';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Circle } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/time';

const STATUS_COLOR: Record<string, string> = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  offline: 'bg-gray-500',
};

export function ActivityPanel() {
  const { theme, activityPanelOpen, toggleActivityPanel, users, activity } = useAppStore();

  return (
    <AnimatePresence initial={false}>
      {activityPanelOpen && (
        <motion.aside
          key="activity"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={`flex flex-col h-full border-l shrink-0 overflow-hidden
            ${theme === 'dark' ? 'bg-[#0f1117] border-white/10' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-inherit">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Activity
              </span>
            </div>
            <button
              onClick={toggleActivityPanel}
              aria-label="Close activity panel"
              className={`p-1 rounded transition-colors
                ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Team presence */}
          <div className={`px-4 py-3 border-b border-inherit`}>
            <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Team
            </p>
            <div className="space-y-2.5">
              {users.map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${STATUS_COLOR[user.status]}
                      ${theme === 'dark' ? 'border-[#0f1117]' : 'border-white'}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {user.status === 'offline' ? 'Offline' : user.currentPage || user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Recent
            </p>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {activity.slice(0, 20).map(item => {
                  const user = users.find(u => u.id === item.userId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: user?.color || '#6366f1' }}
                      >
                        {user?.avatar || '?'}
                      </div>
                      <div>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{user?.name?.split(' ')[0]}</span>{' '}
                          {item.action}{' '}
                          <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>{item.target}</span>
                        </p>
                        <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {formatDistanceToNow(item.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
