'use client';
import { useEffect } from 'react';
import { useAppStore } from '../store';

const PAGES = ['Board', 'Dashboard', 'Analytics', 'Settings'];
const STATUSES: Array<'online' | 'away' | 'offline'> = ['online', 'online', 'online', 'away', 'offline'];

export function usePresence() {
  const { users, updateUserStatus } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const remoteUsers = users.filter(u => u.id !== 'u1');
      const randomUser = remoteUsers[Math.floor(Math.random() * remoteUsers.length)];
      const randomStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      updateUserStatus(randomUser.id, randomStatus);
    }, 8000);
    return () => clearInterval(interval);
  }, [users, updateUserStatus]);
}
