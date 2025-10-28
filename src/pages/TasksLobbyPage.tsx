// src/pages/TasksLobbyPage.tsx
import { Link } from 'react-router-dom';
import { Plus, CheckSquare } from 'lucide-react';
import { Board } from '@/types/tasks';

// MOCK DATA
const MOCK_BOARDS: Board[] = [
  { id: 'board-1', name: 'Воскресное служение' },
  { id: 'board-2', name: 'Подготовка к летнему лагерю' },
  { id: 'board-3', name: 'Молодежное служение' },
  { id: 'board-4', name: 'Детское служение' },
];

export function TasksLobbyPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Пространства задач
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Управляйте проектами и задачами вашей церкви
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Создать доску
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_BOARDS.map((board) => (
          <Link
            to={`/tasks/${board.id}`}
            key={board.id}
            className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">{board.name}</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Задач выполнено:</span>
                <span className="font-medium">12/16</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Последнее обновление: 2 часа назад
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state for when there are no boards */}
      {MOCK_BOARDS.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Нет досок задач
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Создайте первую доску для начала работы с задачами
          </p>
          <div className="mt-6">
            <button className="btn btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Создать доску
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
