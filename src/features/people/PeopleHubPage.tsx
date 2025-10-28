import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { Person } from '@/types/person';
import { AddUserModal } from '@/components';
import { mapUserToPersonStatus } from './lib/mapStatus';
import type { SearchFilters, User } from './types/user';
import { PeopleActions, PeopleHeader, PeopleListContainer, PeopleSmartSearch } from './components';
import { usePeopleState } from './hooks/usePeopleState';

const initialUsers: User[] = [
  {
    id: '1',
    full_name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    status: 'active_member',
    tags: ['Молодежное служение', 'Музыка'],
    avatar_url: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    full_name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    status: 'new_member',
    tags: ['Детское служение'],
    avatar_url: null,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    full_name: 'Алексей Козлов',
    email: 'alexey@example.com',
    phone: '+7 (999) 345-67-89',
    status: 'minister',
    tags: ['Лидерство', 'Проповедь'],
    avatar_url: null,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
];

function toPersonUsers(users: User[]): Person[] {
  return users.map((user) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone || '',
    status: mapUserToPersonStatus(user.status),
    tags: user.tags || [],
  }));
}

/**
 * Displays the main people management page with smart search, view switching and CRUD controls.
 * @returns Полноценная страница управления участниками.
 */
export function PeopleHubPage(): JSX.Element {
  const {
    state,
    filteredUsers,
    addUser,
    updateUser,
    deleteUser,
    setViewMode,
    setSmartFilters,
    setIsAddModalOpen,
    setEditUser,
    resetUsers,
  } = usePeopleState(initialUsers);

  const people = useMemo(() => toPersonUsers(filteredUsers), [filteredUsers]);

  const handleSmartSearch = useCallback(
    (query: string, filters: SearchFilters) => {
      console.debug('Smart search query:', query);
      setSmartFilters(filters);
    },
    [setSmartFilters]
  );

  const handleAddUser = useCallback(
    (newUser: User) => {
      addUser(newUser);
    },
    [addUser]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        deleteUser(userId);
        toast.success('Пользователь удален');
      }
    },
    [deleteUser]
  );

  const handleEditUser = useCallback(
    (userId: string) => {
      const user = state.users.find((u) => u.id === userId) || null;
      if (user) {
        setEditUser(user);
        setIsAddModalOpen(true);
      }
    },
    [state.users, setEditUser, setIsAddModalOpen]
  );

  const handleSaveEdit = useCallback(
    (updated: User) => {
      updateUser(updated);
    },
    [updateUser]
  );

  const handleResetData = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные пользователей?')) {
      localStorage.removeItem('crm-users');
      resetUsers(initialUsers);
    }
  }, [resetUsers]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PeopleHeader total={state.users.length} />
        <PeopleActions
          viewMode={state.viewMode}
          onViewModeChange={setViewMode}
          onReset={handleResetData}
          onAdd={() => {
            setEditUser(null);
            setIsAddModalOpen(true);
          }}
        />
      </div>

      <PeopleSmartSearch people={toPersonUsers(state.users)} onSearch={handleSmartSearch} />

      <PeopleListContainer
        people={people}
        viewMode={state.viewMode}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Участники не найдены
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}

      <AddUserModal
        isOpen={state.isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditUser(null);
        }}
        onAddUser={handleAddUser}
        mode={state.editUser ? 'edit' : 'add'}
        initialUser={state.editUser}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  );
}
