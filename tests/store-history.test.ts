/**
 * Regression tests for undo/redo in the Zustand store (app/store/index.ts).
 *
 * Bugs reproduced before the fix:
 *  1. Undo skipped a step and redo stopped one step short. After moving a card
 *     To Do -> In Progress -> Done, one undo put it back in To Do.
 *  2. After more than 50 actions, historyIndex was 50 while the history only
 *     held 50 entries, so the index pointed past the end of the list.
 *
 * Run with `npm test`. Uses Node's built-in test runner (no extra packages).
 */
import { test, before, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { useAppStore as AppStore } from '../app/store';
import type { CardStatus, Column } from '../app/types';

// The store persists a few UI settings with window.localStorage (zustand's
// persist middleware). Provide an in-memory version so it behaves the same
// as in a browser.
const memoryStorage = new Map<string, string>();
const localStorageShim = {
  getItem: (k: string) => memoryStorage.get(k) ?? null,
  setItem: (k: string, v: string) => void memoryStorage.set(k, v),
  removeItem: (k: string) => void memoryStorage.delete(k),
};
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { localStorage: localStorageShim },
});

let useAppStore: typeof AppStore;
let MAX_HISTORY = 50;

before(async () => {
  // Imported after the localStorage shim above is in place.
  const mod = await import('../app/store');
  useAppStore = mod.useAppStore;
  // Older versions of the store do not export MAX_HISTORY; 50 was hard-coded.
  MAX_HISTORY = (mod as { MAX_HISTORY?: number }).MAX_HISTORY ?? 50;
});

beforeEach(() => {
  // Notifications auto-dismiss with setTimeout; fake timers keep tests fast.
  mock.timers.enable({ apis: ['setTimeout'] });
  useAppStore.setState(useAppStore.getInitialState(), true);
});

afterEach(() => {
  mock.timers.reset();
});

const store = () => useAppStore.getState();

function columnOf(cardId: string): CardStatus | undefined {
  return store().columns.find((c) => c.cards.some((card) => card.id === cardId))?.id;
}

function board(): Column[] {
  return JSON.parse(JSON.stringify(store().columns));
}

/** The board on screen must always equal the history entry at historyIndex. */
function assertHistoryInvariant() {
  const { history, historyIndex } = store();
  assert.ok(historyIndex >= 0, `historyIndex ${historyIndex} is negative`);
  assert.ok(
    historyIndex < history.length,
    `historyIndex ${historyIndex} is out of range for ${history.length} entries`,
  );
  assert.deepEqual(store().columns, history[historyIndex].columns);
}

test('one undo after two moves returns to the state after the first move', () => {
  store().moveCard('c1', 'todo', 'in-progress');
  store().moveCard('c1', 'in-progress', 'done');
  assert.equal(columnOf('c1'), 'done');

  store().undo();
  assert.equal(columnOf('c1'), 'in-progress', 'undo should reverse only the last move');

  store().undo();
  assert.equal(columnOf('c1'), 'todo');

  store().redo();
  assert.equal(columnOf('c1'), 'in-progress');

  store().redo();
  assert.equal(columnOf('c1'), 'done', 'redo should restore the latest move');
});

test('undo and redo step through mixed actions one at a time', () => {
  const snapshots: Column[][] = [board()];

  store().moveCard('c1', 'todo', 'done');
  snapshots.push(board());
  store().updateCard('c2', { title: 'Renamed' });
  snapshots.push(board());
  store().deleteCard('c3');
  snapshots.push(board());
  store().addCard('todo', { title: 'New card', description: '', status: 'todo', priority: 'low', tags: [] });
  snapshots.push(board());
  assertHistoryInvariant();

  for (let i = snapshots.length - 2; i >= 0; i--) {
    store().undo();
    assert.deepEqual(board(), snapshots[i], `undo should restore snapshot ${i}`);
    assertHistoryInvariant();
  }
  for (let i = 1; i < snapshots.length; i++) {
    store().redo();
    assert.deepEqual(board(), snapshots[i], `redo should restore snapshot ${i}`);
    assertHistoryInvariant();
  }
});

test('undo at the start and redo at the end do nothing', () => {
  const initial = board();
  store().undo();
  assert.deepEqual(board(), initial);
  assert.equal(store().historyIndex, 0);

  store().moveCard('c1', 'todo', 'done');
  const latest = board();
  store().redo();
  assert.deepEqual(board(), latest);
});

test('a new action after undo discards the redo branch', () => {
  store().moveCard('c1', 'todo', 'in-progress');
  store().moveCard('c1', 'in-progress', 'done');
  store().undo(); // c1 back in in-progress
  store().moveCard('c2', 'todo', 'done');

  const { history, historyIndex } = store();
  assert.equal(historyIndex, history.length - 1, 'new action must be the newest entry');
  store().redo(); // nothing to redo
  assert.equal(columnOf('c1'), 'in-progress');
  assert.equal(columnOf('c2'), 'done');
  assertHistoryInvariant();
});

test('undo/redo buttons are enabled exactly when there is something to do', () => {
  const canUndo = () => store().historyIndex > 0; // same checks as Topbar.tsx
  const canRedo = () => store().historyIndex < store().history.length - 1;

  assert.equal(canUndo(), false);
  assert.equal(canRedo(), false);
  store().moveCard('c1', 'todo', 'done');
  assert.equal(canUndo(), true);
  assert.equal(canRedo(), false);
  store().undo();
  assert.equal(canUndo(), false);
  assert.equal(canRedo(), true);
});

test('historyIndex never points past the end of history (50-entry boundary)', () => {
  for (let i = 1; i <= MAX_HISTORY + 10; i++) {
    const [from, to]: [CardStatus, CardStatus] = i % 2 === 1 ? ['todo', 'done'] : ['done', 'todo'];
    store().moveCard('c1', from, to);
    const { history, historyIndex } = store();
    assert.ok(history.length <= MAX_HISTORY, `action ${i}: ${history.length} entries exceeds the cap`);
    assert.ok(
      historyIndex < history.length,
      `action ${i}: historyIndex ${historyIndex} is out of range for ${history.length} entries`,
    );
  }
});

test("history is capped at MAX_HISTORY (50) entries and the index stays in range", () => {
  const extra = 10;
  const boards: Column[][] = [];
  for (let i = 0; i < MAX_HISTORY + extra; i++) {
    const [from, to]: [CardStatus, CardStatus] = i % 2 === 0 ? ['todo', 'done'] : ['done', 'todo'];
    store().moveCard('c1', from, to);
    boards.push(board());
    assertHistoryInvariant();
  }

  const { history, historyIndex } = store();
  assert.equal(history.length, MAX_HISTORY);
  assert.equal(historyIndex, MAX_HISTORY - 1);

  // Undo all the way back: every step restores the matching earlier board.
  for (let step = 1; step < MAX_HISTORY; step++) {
    store().undo();
    assert.deepEqual(board(), boards[boards.length - 1 - step], `undo step ${step}`);
  }
  assert.equal(store().historyIndex, 0);

  // One more undo is a no-op: the oldest states were dropped by the cap.
  const oldest = board();
  store().undo();
  assert.deepEqual(board(), oldest);

  // Redo all the way forward again.
  for (let step = 1; step < MAX_HISTORY; step++) store().redo();
  assert.deepEqual(board(), boards[boards.length - 1]);
  assertHistoryInvariant();
});
