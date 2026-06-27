'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { Search, Sun, Moon, Undo2, Redo2, Plus, PanelRight } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const {
    commandPaletteOpen, setCommandPaletteOpen, theme, toggleTheme,
    undo, redo, toggleActivityPanel, addCard
  } = useAppStore();
  const [query, setQuery] = useState('');

  const commands: Command[] = useMemo(() => [
    { id: 'theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, action: () => { toggleTheme(); setCommandPaletteOpen(false); }, group: 'Appearance' },
    { id: 'activity', label: 'Toggle Activity Panel', icon: <PanelRight className="w-4 h-4" />, action: () => { toggleActivityPanel(); setCommandPaletteOpen(false); }, group: 'Layout' },
    { id: 'undo', label: 'Undo last action', icon: <Undo2 className="w-4 h-4" />, action: () => { undo(); setCommandPaletteOpen(false); }, group: 'History' },
    { id: 'redo', label: 'Redo last action', icon: <Redo2 className="w-4 h-4" />, action: () => { redo(); setCommandPaletteOpen(false); }, group: 'History' },
    { id: 'add-todo', label: 'Add card to To Do', icon: <Plus className="w-4 h-4" />, action: () => { addCard('todo', { title: 'New task', description: '', status: 'todo', priority: 'medium', tags: [] }); setCommandPaletteOpen(false); }, group: 'Cards' },
    { id: 'add-progress', label: 'Add card to In Progress', icon: <Plus className="w-4 h-4" />, action: () => { addCard('in-progress', { title: 'New task', description: '', status: 'in-progress', priority: 'medium', tags: [] }); setCommandPaletteOpen(false); }, group: 'Cards' },
  ], [theme, toggleTheme, setCommandPaletteOpen, toggleActivityPanel, undo, redo, addCard]);

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    if (!commandPaletteOpen) setQuery('');
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setCommandPaletteOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className={`fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-md z-50
              rounded-2xl shadow-2xl border overflow-hidden
              ${theme === 'dark' ? 'bg-[#161b27] border-white/15' : 'bg-white border-gray-200'}`}
          >
            {/* Search input */}
            <div className={`flex items-center gap-3 px-4 py-3.5 border-b
              ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <Search className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands…"
                className={`flex-1 bg-transparent text-sm outline-none
                  ${theme === 'dark' ? 'text-gray-100 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'}`}
              />
              <kbd className={`text-xs px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                ESC
              </kbd>
            </div>

            {/* Commands */}
            <div className="max-h-72 overflow-y-auto py-2">
              {Object.keys(grouped).length === 0 && (
                <p className={`text-sm text-center py-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                  No commands found
                </p>
              )}
              {Object.entries(grouped).map(([group, cmds]) => (
                <div key={group}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider px-4 py-2
                    ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {group}
                  </p>
                  {cmds.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                        ${theme === 'dark'
                          ? 'text-gray-300 hover:bg-indigo-500/20 hover:text-white'
                          : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                    >
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>{cmd.icon}</span>
                      {cmd.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
