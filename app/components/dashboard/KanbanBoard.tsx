'use client';
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, closestCorners
} from '@dnd-kit/core';
import { useAppStore } from '../../store';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { CardStatus } from '../../types';
import { useState } from 'react';

export function KanbanBoard() {
  const { columns, moveCard, addActivity } = useAppStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const findCardAndCol = (cardId: string) => {
    for (const col of columns) {
      const card = col.cards.find(c => c.id === cardId);
      if (card) return { card, colId: col.id as CardStatus };
    }
    return null;
  };

  const handleDragStart = (e: DragStartEvent) => setDraggingId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const fromResult = findCardAndCol(activeId);
    if (!fromResult) return;
    const { colId: fromCol } = fromResult;

    // Dropped on a column
    if (columns.find(c => c.id === overId)) {
      const toCol = overId as CardStatus;
      if (fromCol !== toCol) {
        moveCard(activeId, fromCol, toCol);
        addActivity({ userId: 'u1', action: 'moved', target: `card to ${toCol}` });
      }
      return;
    }

    // Dropped on another card
    const toResult = findCardAndCol(overId);
    if (!toResult) return;
    const { colId: toCol } = toResult;
    moveCard(activeId, fromCol, toCol, overId);
    if (fromCol !== toCol) addActivity({ userId: 'u1', action: 'moved', target: `card to ${toCol}` });
  };

  const draggingCard = draggingId ? findCardAndCol(draggingId)?.card : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 h-full overflow-x-auto pb-4">
        {columns.map(col => <KanbanColumn key={col.id} column={col} />)}
      </div>
      <DragOverlay>
        {draggingCard && <KanbanCard card={draggingCard} />}
      </DragOverlay>
    </DndContext>
  );
}
