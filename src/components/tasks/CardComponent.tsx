// src/components/tasks/CardComponent.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/types/tasks";
import { MoreHorizontal, Calendar, User } from 'lucide-react';

interface CardComponentProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

/**
 * Kanban card with drag/drop interactions and optional actions.
 */
export function CardComponent({ card, onEdit, onDelete }: CardComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: card.id,
    data: {
      type: 'card',
      card: card,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
          {card.title}
        </h4>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Card Description */}
      {card.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Due Date */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Без срока</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <div className="flex -space-x-1">
            <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        {onEdit && (
          <button className="btn btn-secondary text-xs" onClick={() => onEdit(card)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
