'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

export function Toasts() {
  const { notifications, theme } = useAppStore();
  const visible = notifications.slice(0, 3);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {visible.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm
              ${theme === 'dark'
                ? 'bg-[#1e2535] border-white/15 text-gray-200'
                : 'bg-white border-gray-200 text-gray-700'
              }`}
          >
            {ICONS[n.type]}
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
