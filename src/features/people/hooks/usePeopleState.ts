import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { SearchFilters, User, ViewMode } from '../types/user';

interface PeopleState {
  users: User[];
  viewMode: ViewMode;
  smartFilters: SearchFilters;
  searchTerm: string;
  selectedStatus: string;
  isAddModalOpen: boolean;
  editUser: User | null;
}

type PeopleAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'RESET_USERS'; payload: User[] }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SMART_FILTERS'; payload: SearchFilters }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SELECTED_STATUS'; payload: string }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_EDIT_USER'; payload: User | null };

const STORAGE_KEY = 'crm-users';

function peopleReducer(state: PeopleState, action: PeopleAction): PeopleState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter((user) => user.id !== action.payload) };
    case 'RESET_USERS':
      return { ...state, users: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SMART_FILTERS':
      return { ...state, smartFilters: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_STATUS':
      return { ...state, selectedStatus: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isAddModalOpen: action.payload };
    case 'SET_EDIT_USER':
      return { ...state, editUser: action.payload };
    default:
      return state;
  }
}

const initialState: PeopleState = {
  users: [],
  viewMode: 'grid',
  smartFilters: {},
  searchTerm: '',
  selectedStatus: 'all',
  isAddModalOpen: false,
  editUser: null,
};

function loadInitialUsers(fallback: User[]): User[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as User[];
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователей из localStorage:', error);
  }
  return fallback;
}

/**
 * Manages people feature state with persistence and memoized selectors.
 * @param initialUsers Список пользователей по умолчанию.
 */
export function usePeopleState(initialUsers: User[]) {
  const [state, dispatch] = useReducer(peopleReducer, initialState, (prior) => ({
    ...prior,
    users: loadInitialUsers(initialUsers),
  }));

  const addUser = useCallback((user: User) => {
    dispatch({ type: 'ADD_USER', payload: user });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const deleteUser = useCallback((userId: string) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  }, []);

  const resetUsers = useCallback((users: User[]) => {
    dispatch({ type: 'RESET_USERS', payload: users });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const setSmartFilters = useCallback((filters: SearchFilters) => {
    dispatch({ type: 'SET_SMART_FILTERS', payload: filters });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setSelectedStatus = useCallback((status: string) => {
    dispatch({ type: 'SET_SELECTED_STATUS', payload: status });
  }, []);

  const setIsAddModalOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: open });
  }, []);

  const setEditUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_EDIT_USER', payload: user });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.users));
    } catch (error) {
      console.error('Ошибка сохранения пользователей в localStorage:', error);
    }
  }, [state.users]);

  const filteredUsers = useMemo(() => {
    const { users, searchTerm, selectedStatus, smartFilters } = state;

    return users.filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

      let matchesSmartFilters = true;

      if (smartFilters.status && smartFilters.status.length > 0) {
        const statusMap: Record<string, string> = {
          active_member: 'active',
          new_member: 'new',
          minister: 'leader',
          guest: 'guest',
          left: 'guest',
        };
        const mappedStatus = statusMap[user.status] || 'guest';
        matchesSmartFilters = matchesSmartFilters && smartFilters.status.includes(mappedStatus);
      }

      if (smartFilters.tags && smartFilters.tags.length > 0) {
        matchesSmartFilters =
          matchesSmartFilters && smartFilters.tags.some((tag) => user.tags.includes(tag));
      }

      if (smartFilters.name) {
        matchesSmartFilters =
          matchesSmartFilters &&
          user.full_name.toLowerCase().includes(smartFilters.name.toLowerCase());
      }

      if (smartFilters.email) {
        matchesSmartFilters =
          matchesSmartFilters &&
          user.email.toLowerCase().includes(smartFilters.email.toLowerCase());
      }

      const hasSmartFilters = Object.keys(smartFilters).length > 0;
      return hasSmartFilters ? matchesSmartFilters : matchesSearch && matchesStatus;
    });
  }, [state]);

  return {
    state,
    filteredUsers,
    addUser,
    updateUser,
    deleteUser,
    setViewMode,
    setSmartFilters,
    setSearchTerm,
    setSelectedStatus,
    setIsAddModalOpen,
    setEditUser,
    resetUsers,
  };
}
