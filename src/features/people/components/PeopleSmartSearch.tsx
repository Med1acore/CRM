import type { FC } from 'react';
import type { Person } from '@/types/person';
import { SmartSearchBar } from '@/components';
import type { SearchFilters } from '../types/user';

interface PeopleSmartSearchProps {
  people: Person[];
  onSearch: (query: string, filters: SearchFilters) => void;
}

/**
 * Smart search panel for natural language queries across people data.
 */
export const PeopleSmartSearch: FC<PeopleSmartSearchProps> = ({ people, onSearch }) => (
  <div className="card p-6 relative z-10">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Умный поиск</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Попробуйте: "Покажи всех гостей с тегом Музыка" или "Найди активных участников"
      </p>
    </div>
    <SmartSearchBar onSearch={onSearch} people={people} />
  </div>
);
