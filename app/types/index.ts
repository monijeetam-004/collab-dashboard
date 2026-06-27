export type Theme = 'dark' | 'light';

export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  color: string;
  currentPage?: string;
}

export type CardStatus = 'todo' | 'in-progress' | 'done';
export type CardPriority = 'low' | 'medium' | 'high';

export interface Card {
  id: string;
  title: string;
  description: string;
  status: CardStatus;
  priority: CardPriority;
  assignee?: string;
  tags: string[];
  createdAt: number;
}

export interface Column {
  id: CardStatus;
  title: string;
  cards: Card[];
}

export interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: number;
  read: boolean;
}

export interface HistoryEntry {
  columns: Column[];
  timestamp: number;
  description: string;
}
