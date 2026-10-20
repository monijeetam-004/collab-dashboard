/**
 * Checks on the seed data for the demo board (app/store/index.ts).
 *
 * The board ships with sample teammates. Everyone except the signed-in user
 * (u1) must be clearly fictional, and every seed card and activity entry must
 * point at a user that exists, so renaming users can't leave dangling
 * references.
 *
 * Run with `npm test`.
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import type { useAppStore as AppStore } from '../app/store';

// zustand's persist middleware reads window.localStorage; provide one in memory.
const memoryStorage = new Map<string, string>();
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    localStorage: {
      getItem: (k: string) => memoryStorage.get(k) ?? null,
      setItem: (k: string, v: string) => void memoryStorage.set(k, v),
      removeItem: (k: string) => void memoryStorage.delete(k),
    },
  },
});

let useAppStore: typeof AppStore;

before(async () => {
  ({ useAppStore } = await import('../app/store'));
});

const initial = () => useAppStore.getInitialState();

test('every seed teammate other than the signed-in user is marked as demo data', () => {
  const others = initial().users.filter((u) => u.id !== 'u1');
  assert.ok(others.length > 0);
  for (const user of others) {
    assert.match(user.name, /\(demo\)$/, `${user.id} should be a fictional "(demo)" user`);
  }
});

test('the signed-in user is unchanged', () => {
  const me = initial().users.find((u) => u.id === 'u1');
  assert.equal(me?.name, 'Monijeeta Moitra');
  assert.equal(me?.avatar, 'MM');
});

test('user ids and avatar initials are unique', () => {
  const users = initial().users;
  assert.equal(new Set(users.map((u) => u.id)).size, users.length);
  assert.equal(new Set(users.map((u) => u.avatar)).size, users.length);
});

test('seed cards and activity only reference users that exist', () => {
  const ids = new Set(initial().users.map((u) => u.id));
  for (const column of initial().columns) {
    for (const card of column.cards) {
      if (card.assignee) assert.ok(ids.has(card.assignee), `card ${card.id} -> ${card.assignee}`);
    }
  }
  for (const item of initial().activity) {
    assert.ok(ids.has(item.userId), `activity ${item.id} -> ${item.userId}`);
  }
});
