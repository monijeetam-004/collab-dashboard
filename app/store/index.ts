import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Theme, User, Column, Card, CardStatus, ActivityItem,
  Notification, HistoryEntry
} from '../types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', avatar: 'AC', status: 'online', color: '#6366f1', currentPage: 'Board' },
  { id: 'u2', name: 'Bob Marsh', avatar: 'BM', status: 'online', color: '#f59e0b', currentPage: 'Dashboard' },
  { id: 'u3', name: 'Carol Lee', avatar: 'CL', status: 'away', color: '#10b981', currentPage: 'Settings' },
  { id: 'u4', name: 'Dan Park', avatar: 'DP', status: 'offline', color: '#ef4444', currentPage: undefined },
];

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'c1', title: 'Design system audit', description: 'Review all existing components for consistency', status: 'todo', priority: 'high', assignee: 'u1', tags: ['design', 'audit'], createdAt: Date.now() - 86400000 * 3 },
      { id: 'c2', title: 'API rate limiting', description: 'Implement proper rate limiting on all endpoints', status: 'todo', priority: 'medium', assignee: 'u2', tags: ['backend', 'security'], createdAt: Date.now() - 86400000 * 2 },
      { id: 'c3', title: 'Onboarding flow', description: 'Create user onboarding wizard with 5 steps', status: 'todo', priority: 'low', tags: ['ux', 'product'], createdAt: Date.now() - 86400000 },
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      { id: 'c4', title: 'Collaboration dashboard', description: 'Build real-time presence & collaboration features', status: 'in-progress', priority: 'high', assignee: 'u1', tags: ['frontend', 'realtime'], createdAt: Date.now() - 86400000 * 5 },
      { id: 'c5', title: 'Mobile responsiveness', description: 'Fix layout issues on small screens', status: 'in-progress', priority: 'medium', assignee: 'u3', tags: ['mobile', 'css'], createdAt: Date.now() - 86400000 * 4 },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'c6', title: 'Authentication setup', description: 'JWT auth with refresh tokens', status: 'done', priority: 'high', assignee: 'u2', tags: ['auth', 'backend'], createdAt: Date.now() - 86400000 * 10 },
      { id: 'c7', title: 'CI/CD pipeline', description: 'GitHub Actions with automated deploys', status: 'done', priority: 'medium', tags: ['devops'], createdAt: Date.now() - 86400000 * 7 },
    ]
  }
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: 'a1', userId: 'u1', action: 'moved', target: 'Authentication setup to Done', timestamp: Date.now() - 60000 * 5 },
  { id: 'a2', userId: 'u2', action: 'created', target: 'API rate limiting', timestamp: Date.now() - 60000 * 15 },
  { id: 'a3', userId: 'u3', action: 'commented on', target: 'Mobile responsiveness', timestamp: Date.now() - 60000 * 30 },
  { id: 'a4', userId: 'u1', action: 'assigned', target: 'Design system audit to Alice', timestamp: Date.now() - 60000 * 60 },
];

interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  activityPanelOpen: boolean;
  commandPaletteOpen: boolean;
  users: User[];
  columns: Column[];
  activity: ActivityItem[];
  notifications: Notification[];
  history: HistoryEntry[];
  historyIndex: number;
  activeCard: Card | null;

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleActivityPanel: () => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  moveCard: (cardId: string, fromCol: CardStatus, toCol: CardStatus, overCardId?: string) => void;
  addCard: (colId: CardStatus, card: Omit<Card, 'id' | 'createdAt'>) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  setActiveCard: (card: Card | null) => void;
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  addNotification: (msg: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  undo: () => void;
  redo: () => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
}

function pushHistory(state: AppState, description: string): Pick<AppState, 'history' | 'historyIndex'> {
  const entry: HistoryEntry = { columns: JSON.parse(JSON.stringify(state.columns)), timestamp: Date.now(), description };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(entry);
  return { history: newHistory.slice(-50), historyIndex: newHistory.length - 1 };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      activityPanelOpen: true,
      commandPaletteOpen: false,
      users: MOCK_USERS,
      columns: INITIAL_COLUMNS,
      activity: INITIAL_ACTIVITY,
      notifications: [],
      history: [{ columns: INITIAL_COLUMNS, timestamp: Date.now(), description: 'Initial state' }],
      historyIndex: 0,
      activeCard: null,

      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      toggleActivityPanel: () => set(s => ({ activityPanelOpen: !s.activityPanelOpen })),
      toggleCommandPalette: () => set(s => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setActiveCard: (card) => set({ activeCard: card }),

      moveCard: (cardId, fromCol, toCol, overCardId) => {
        const state = get();
        const hist = pushHistory(state, `Moved card to ${toCol}`);
        set(s => {
          const cols = JSON.parse(JSON.stringify(s.columns)) as Column[];
          const from = cols.find(c => c.id === fromCol)!;
          const to = cols.find(c => c.id === toCol)!;
          const cardIdx = from.cards.findIndex(c => c.id === cardId);
          if (cardIdx === -1) return {};
          const [card] = from.cards.splice(cardIdx, 1);
          card.status = toCol;
          if (overCardId) {
            const overIdx = to.cards.findIndex(c => c.id === overCardId);
            to.cards.splice(overIdx, 0, card);
          } else {
            to.cards.push(card);
          }
          return { columns: cols, ...hist };
        });
      },

      addCard: (colId, cardData) => {
        const state = get();
        const hist = pushHistory(state, `Created "${cardData.title}"`);
        const newCard: Card = { ...cardData, id: `c${Date.now()}`, createdAt: Date.now() };
        set(s => {
          const cols = JSON.parse(JSON.stringify(s.columns)) as Column[];
          const col = cols.find(c => c.id === colId)!;
          col.cards.unshift(newCard);
          return { columns: cols, ...hist };
        });
        get().addActivity({ userId: 'u1', action: 'created', target: cardData.title });
        get().addNotification(`Card "${cardData.title}" created`, 'success');
      },

      updateCard: (cardId, updates) => {
        const state = get();
        const hist = pushHistory(state, 'Updated card');
        set(s => {
          const cols = JSON.parse(JSON.stringify(s.columns)) as Column[];
          for (const col of cols) {
            const card = col.cards.find(c => c.id === cardId);
            if (card) { Object.assign(card, updates); break; }
          }
          return { columns: cols, ...hist };
        });
      },

      deleteCard: (cardId) => {
        const state = get();
        const hist = pushHistory(state, 'Deleted card');
        set(s => {
          const cols = JSON.parse(JSON.stringify(s.columns)) as Column[];
          for (const col of cols) {
            const idx = col.cards.findIndex(c => c.id === cardId);
            if (idx !== -1) { col.cards.splice(idx, 1); break; }
          }
          return { columns: cols, ...hist };
        });
        get().addNotification('Card deleted', 'info');
      },

      addActivity: (item) => {
        set(s => ({
          activity: [{ ...item, id: `a${Date.now()}`, timestamp: Date.now() }, ...s.activity].slice(0, 50)
        }));
      },

      addNotification: (message, type) => {
        const notif: Notification = { id: `n${Date.now()}`, message, type, timestamp: Date.now(), read: false };
        set(s => ({ notifications: [notif, ...s.notifications].slice(0, 20) }));
        setTimeout(() => {
          set(s => ({ notifications: s.notifications.filter(n => n.id !== notif.id) }));
        }, 4000);
      },

      markNotificationRead: (id) => {
        set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
      },

      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex <= 0) return;
        const newIndex = historyIndex - 1;
        set({ columns: JSON.parse(JSON.stringify(history[newIndex].columns)), historyIndex: newIndex });
        get().addNotification('Undone', 'info');
      },

      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex >= history.length - 1) return;
        const newIndex = historyIndex + 1;
        set({ columns: JSON.parse(JSON.stringify(history[newIndex].columns)), historyIndex: newIndex });
        get().addNotification('Redone', 'info');
      },

      updateUserStatus: (userId, status) => {
        set(s => ({ users: s.users.map(u => u.id === userId ? { ...u, status } : u) }));
      },
    }),
    {
      name: 'collab-dashboard-store',
      partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen, activityPanelOpen: s.activityPanelOpen }),
    }
  )
);
