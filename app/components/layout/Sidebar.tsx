'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import {
  LayoutDashboard, Kanban, Users, Bell, Settings,
  ChevronLeft, Zap, BarChart3
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
  { icon: Kanban, label: 'Board', href: '#' },
  { icon: BarChart3, label: 'Analytics', href: '#' },
  { icon: Users, label: 'Team', href: '#' },
  { icon: Bell, label: 'Notifications', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, theme } = useAppStore();

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        key="sidebar"
        initial={false}
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`flex flex-col h-full border-r shrink-0 overflow-hidden
          ${theme === 'dark' ? 'bg-[#0f1117] border-white/10' : 'bg-white border-gray-200'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-inherit">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className={`font-semibold text-sm whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                CollabSpace
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(({ icon: Icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 group
                ${theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }
                ${label === 'Board' ? (theme === 'dark' ? '!text-white !bg-indigo-500/20 !border !border-indigo-500/40' : '!text-indigo-600 !bg-indigo-50') : ''}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`mx-2 mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
            ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
