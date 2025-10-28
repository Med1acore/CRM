import { supabase } from './supabase';
import type { Database } from './supabase';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export const eventsRepository = {
  async getAll() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    if (error) throw error;
    return data as Event[];
  },

  async getById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Event;
  },

  async create(event: EventInsert) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) throw error;
    return data as Event;
  },

  async update(id: string, updates: EventUpdate) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Event;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async getUpcoming(limit = 10) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', now)
      .order('start_date', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data as Event[];
  },

  async getByDateRange(startDate: string, endDate: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate)
      .order('start_date', { ascending: true });
    if (error) throw error;
    return data as Event[];
  },

  async getVolunteers(eventId: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('event_volunteers')
      .select('*, users(*)')
      .eq('event_id', eventId);
    if (error) throw error;
    return data;
  },

  async addVolunteer(eventId: string, userId: string, role: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase
      .from('event_volunteers')
      .insert({ event_id: eventId, user_id: userId, role })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
