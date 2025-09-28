// src/pages/BoardPage.tsx
import { useParams } from "react-router-dom";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { List } from '@/types/tasks';
import { ListComponent } from '@/components/tasks/ListComponent';

// MOCK DATA for a single board
const MOCK_LISTS: List[] = [
  { 
    id: 'list-1', 
    board_id: 'board-1', 
    name: 'Нужно сделать', 
    position: 0, 
    cards: [ 
      { id: 'card-1', list_id: 'list-1', title: 'Подготовить графику для воскресного служения', position: 0 },
      { id: 'card-2', list_id: 'list-1', title: 'Настроить звуковое оборудование', position: 1 },
      { id: 'card-3', list_id: 'list-1', title: 'Подготовить проповедь', position: 2 }
    ] 
  },
  { 
    id: 'list-2', 
    board_id: 'board-1', 
    name: 'В работе', 
    position: 1, 
    cards: [
      { id: 'card-4', list_id: 'list-2', title: 'Репетиция с музыкальной командой', position: 0 }
    ] 
  },
  { 
    id: 'list-3', 
    board_id: 'board-1', 
    name: 'Готово', 
    position: 2, 
    cards: [
      { id: 'card-5', list_id: 'list-3', title: 'Заказать цветы для алтаря', position: 0 },
      { id: 'card-6', list_id: 'list-3', title: 'Подготовить программы', position: 1 }
    ] 
  },
];

export function BoardPage() {
  const { boardId: _boardId } = useParams<{ boardId: string }>();
  const [lists, setLists] = useState<List[]>(MOCK_LISTS);
  const [activeCard, setActiveCard] = useState<any>(null);

  // Настройка сенсоров для drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  // TODO: Use Zustand for state management
  // TODO: Fetch real data based on boardId from URL params

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log("DRAG START:", active.id);
    const card = lists
      .flatMap(list => list.cards)
      .find(card => card.id === active.id);
    setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    
    if (!over) return;
    if (active.id === over.id) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    console.log("DRAG END:", { activeId, overId });
    
    // Находим активную карточку
    const activeCard = lists
      .flatMap(list => list.cards)
      .find(card => card.id === activeId);
    
    if (!activeCard) return;
    
    // Если перетаскиваем в другую колонку
    if (overId.startsWith('list-')) {
      const targetListId = overId;
      
      // Перемещаем карточку в новую колонку
      setLists(prevLists => 
        prevLists.map(list => {
          if (list.id === activeCard.list_id) {
            // Удаляем карточку из исходной колонки
            return {
              ...list,
              cards: list.cards.filter(card => card.id !== activeId)
            };
          } else if (list.id === targetListId) {
            // Добавляем карточку в целевую колонку
            return {
              ...list,
              cards: [...list.cards, { ...activeCard, list_id: targetListId, position: list.cards.length }]
            };
          }
          return list;
        })
      );
    }
  };

  const boardName = "Воскресное служение"; // TODO: Get from API

  return (
    <div className="p-8 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/tasks" 
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {boardName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Доска задач • {lists.length} колонок • {lists.reduce((acc, list) => acc + list.cards.length, 0)} задач
            </p>
          </div>
        </div>
        
        <button className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Добавить карточку
        </button>
      </div>

      {/* Board Content */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto flex-1 pb-6">
          {lists.map((list) => (
            <ListComponent 
              key={list.id} 
              list={list} 
              onAddCard={(listId) => {
                console.log('Add card to list:', listId);
                // TODO: Implement add card functionality
              }}
            />
          ))}
          
          {/* Add List Button */}
          <button className="w-72 h-fit p-4 text-left text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 flex-shrink-0">
            <Plus className="h-5 w-5 mr-2" />
            Добавить колонку
          </button>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeCard ? (
            <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg opacity-90 rotate-3">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {activeCard.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
