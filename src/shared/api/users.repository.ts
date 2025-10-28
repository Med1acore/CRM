import { supabase } from './supabase';
import type { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const usersRepository = {
  async getAll() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as User[];
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data as User;
  },

  async create(user: UserInsert) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('users').insert(user).select().single();
    if (error) throw error;
    return data as User;
  },

  async update(id: string, updates: UserUpdate) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  async searchByName(query: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('full_name', `%${query}%`)
      .order('full_name', { ascending: true });
    if (error) throw error;
    return data as User[];
  },

  async getByStatus(status: User['status']) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('users').select('*').eq('status', status);
    if (error) throw error;
    return data as User[];
  },
};
