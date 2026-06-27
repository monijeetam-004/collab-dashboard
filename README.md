# CollabSpace — Live Collaboration Dashboard

A highly interactive, state-driven SaaS product interface built with Next.js 15, Zustand, Framer Motion, and @dnd-kit.

## Features

### Level 1 — Core UI and State
- Multi-panel layout: collapsible sidebar, main workspace, activity panel
- Component-based architecture with TypeScript
- Global state management via **Zustand** (with localStorage persistence)
- Dark/light theme system with persistence

### Level 2 — Advanced Interactions
- **Drag-and-drop** Kanban board (via @dnd-kit) — drag cards between columns
- **Command palette** (⌘K / Ctrl+K) — search and run actions
- **Skeleton loaders** on initial board load
- Optimistic UI updates
- Smooth animations via Framer Motion

### Level 3 — Real-Time Experience and Polish
- **Presence indicators** — simulated live user status (online/away/offline)
- **Undo/Redo** with full state history (Ctrl+Z / Ctrl+Y)
- Toast notification system with auto-dismiss
- Activity feed with timestamped events

### Bonus
- Full keyboard navigation (ARIA labels throughout)
- `prefers-reduced-motion` respected via CSS

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Zustand | Global state management |
| Framer Motion | Animations |
| @dnd-kit | Drag-and-drop |
| lucide-react | Icons |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Keyboard Shortcuts

| Shortcut | Action |
|---------|--------|
| Cmd/Ctrl+K | Open command palette |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Escape | Close modals |

## Project Structure

```
app/
  components/
    dashboard/   KanbanBoard, KanbanColumn, KanbanCard, CardModal
    layout/      Sidebar, Topbar, ActivityPanel
    ui/          CommandPalette, Toasts, SkeletonCard
  hooks/         useKeyboardShortcuts, usePresence
  store/         Zustand store
  types/         TypeScript interfaces
  utils/         Helpers
```

## Deployment

```bash
npx vercel
```
