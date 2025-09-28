// src/components/tasks/ListComponent.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { List } from "@/types/tasks";
import { CardComponent } from './CardComponent';
import { Plus } from 'lucide-react';

interface ListComponentProps {
  list: List;
  onAddCard?: (listId: string) => void;
}

export function ListComponent({ list, onAddCard }: ListComponentProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: 'list',
      list: list,
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-200 ${
        isOver ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg' : ''
      }`}
    >
      {/* List Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {list.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {list.cards.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <div className="p-4 space-y-3 min-h-[200px]">
        <SortableContext items={list.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </SortableContext>
        
        {/* Add Card Button */}
        <button 
          onClick={() => onAddCard?.(list.id)}
          className="w-full p-3 text-left text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <Plus className="inline h-4 w-4 mr-2" />
          Добавить карточку
        </button>
      </div>
    </div>
  );
}
