import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersRepository } from '../api';
import type { Database } from '../api';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersRepository.getAll(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersRepository.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UserInsert) => usersRepository.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UserUpdate }) =>
      usersRepository.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => usersRepository.searchByName(query),
    enabled: query.length > 0,
  });
};

export const useUsersByStatus = (status: User['status']) => {
  return useQuery({
    queryKey: ['users', 'status', status],
    queryFn: () => usersRepository.getByStatus(status),
  });
};

