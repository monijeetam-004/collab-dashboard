'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ActivityPanel } from './components/layout/ActivityPanel';
import { KanbanBoard } from './components/dashboard/KanbanBoard';
import { CardModal } from './components/dashboard/CardModal';
import { CommandPalette } from './components/ui/CommandPalette';
import { Toasts } from './components/ui/Toasts';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePresence } from './hooks/usePresence';
import { SkeletonCard } from './components/ui/SkeletonCard';
import { PanelRight } from 'lucide-react';

function AppInner() {
  const { theme, activityPanelOpen, toggleActivityPanel } = useAppStore();
  const [loading, setLoading] = useState(true);
  useKeyboardShortcuts();
  usePresence();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === 'dark' ? 'bg-[#0a0d14] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        <main className="flex-1 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Project Board
              </h1>
              <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Drag cards between columns · Click to edit · ⌘K for commands
              </p>
            </div>
            {!activityPanelOpen && (
              <button
                onClick={toggleActivityPanel}
                aria-label="Show activity panel"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <PanelRight className="w-4 h-4" />
                Activity
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className={`min-w-[300px] rounded-2xl border p-4 space-y-3
                  ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`h-4 w-24 rounded animate-pulse ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                  {[1, 2].map(j => <SkeletonCard key={j} />)}
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <KanbanBoard />
            </motion.div>
          )}
        </main>
      </div>

      <ActivityPanel />
      <CardModal />
      <CommandPalette />
      <Toasts />
    </div>
  );
}

export default function Home() {
  return <AppInner />;
}
