'use client';
import { useAppStore } from '../../store';

export function SkeletonCard() {
  const { theme } = useAppStore();
  const base = theme === 'dark' ? 'bg-white/10' : 'bg-gray-200';
  return (
    <div className={`rounded-xl p-3.5 border animate-pulse ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
      <div className={`h-3 w-16 rounded-full mb-3 ${base}`} />
      <div className={`h-4 w-3/4 rounded mb-2 ${base}`} />
      <div className={`h-3 w-full rounded mb-1 ${base}`} />
      <div className={`h-3 w-2/3 rounded ${base}`} />
    </div>
  );
}
