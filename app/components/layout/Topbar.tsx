'use client';
import { useAppStore } from '../../store';
import { Search, Sun, Moon, Undo2, Redo2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export function Topbar() {
  const { theme, toggleTheme, toggleCommandPalette, undo, redo, historyIndex, history, notifications, users } = useAppStore();
  const onlineUsers = users.filter(u => u.status === 'online');
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className={`flex items-center justify-between px-6 py-3 border-b shrink-0
      ${theme === 'dark' ? 'bg-[#0f1117] border-white/10' : 'bg-white border-gray-200'}`}
    >
      {/* Search trigger */}
      <button
        onClick={toggleCommandPalette}
        aria-label="Open command palette (Ctrl+K)"
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors
          ${theme === 'dark'
            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
          }`}
      >
        <Search className="w-4 h-4" />
        <span>Search or run command…</span>
        <kbd className={`ml-4 text-xs px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        {/* Online presence avatars */}
        <div className="flex -space-x-2">
          {onlineUsers.map(u => (
            <div
              key={u.id}
              title={`${u.name} — ${u.currentPage}`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ring-2 ring-offset-1 shrink-0"
              style={{ backgroundColor: u.color }}
            >
              {u.avatar}
            </div>
          ))}
        </div>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {onlineUsers.length} online
        </span>

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          aria-label="Undo"
          className={`p-2 rounded-lg transition-colors disabled:opacity-30
            ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          aria-label="Redo"
          className={`p-2 rounded-lg transition-colors disabled:opacity-30
            ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className={`p-2 rounded-lg transition-colors
              ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Bell className="w-4 h-4" />
          </button>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`p-2 rounded-lg transition-colors
            ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
