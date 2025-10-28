import { supabase } from './supabase';
import type { Database } from './supabase';

type Group = Database['public']['Tables']['groups']['Row'];
type GroupInsert = Database['public']['Tables']['groups']['Insert'];
type GroupUpdate = Database['public']['Tables']['groups']['Update'];
type GroupMember = Database['public']['Tables']['group_members']['Row'];

export const groupsRepository = {
  async getAll() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Group[];
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('groups').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Group;
  },

  async create(group: GroupInsert) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('groups').insert(group).select().single();
    if (error) throw error;
    return data as Group;
  },

  async update(id: string, updates: GroupUpdate) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('groups').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Group;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { error } = await supabase.from('groups').delete().eq('id', id);
    if (error) throw error;
  },

  async getMembers(groupId: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('group_members')
      .select('*, users(*)')
      .eq('group_id', groupId);
    if (error) throw error;
    return data;
  },

  async addMember(groupId: string, userId: string, role: GroupMember['role'] = 'member') {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId, role })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeMember(groupId: string, userId: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  },
};

