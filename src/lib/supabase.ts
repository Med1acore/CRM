import { createClient } from '@supabase/supabase-js'

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing; auth features will be disabled.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          telegram: string | null
          date_of_birth: string | null
          status: 'guest' | 'new_member' | 'active_member' | 'minister' | 'left'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          telegram?: string | null
          date_of_birth?: string | null
          status?: 'guest' | 'new_member' | 'active_member' | 'minister' | 'left'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          telegram?: string | null
          date_of_birth?: string | null
          status?: 'guest' | 'new_member' | 'active_member' | 'minister' | 'left'
          created_at?: string
          updated_at?: string
        }
      }
      family_connections: {
        Row: {
          id: string
          user_id: string
          related_user_id: string
          relationship_type: 'spouse' | 'parent' | 'child' | 'sibling'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          related_user_id: string
          relationship_type: 'spouse' | 'parent' | 'child' | 'sibling'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          related_user_id?: string
          relationship_type?: 'spouse' | 'parent' | 'child' | 'sibling'
          created_at?: string
        }
      }
      user_tags: {
        Row: {
          id: string
          user_id: string
          tag_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tag_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tag_name?: string
          created_at?: string
        }
      }
      growth_steps: {
        Row: {
          id: string
          user_id: string
          step_type: string
          title: string
          description: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          step_type: string
          title: string
          description?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          step_type?: string
          title?: string
          description?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          leader_id: string
          schedule: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          leader_id: string
          schedule?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          leader_id?: string
          schedule?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'leader' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'leader' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'leader' | 'member'
          joined_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          organizer_id: string
          qr_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          location?: string | null
          organizer_id: string
          qr_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          location?: string | null
          organizer_id?: string
          qr_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_volunteers: {
        Row: {
          id: string
          event_id: string
          user_id: string
          role: string
          assigned_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          role: string
          assigned_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          role?: string
          assigned_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          event_id: string
          user_id: string
          checked_in_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          checked_in_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          checked_in_at?: string
        }
      }
      message_templates: {
        Row: {
          id: string
          name: string
          content: string
          variables: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          variables?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          variables?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          title: string
          content: string
          template_id: string | null
          sender_id: string
          scheduled_at: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          template_id?: string | null
          sender_id: string
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          template_id?: string | null
          sender_id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
      message_recipients: {
        Row: {
          id: string
          message_id: string
          user_id: string
          delivery_status: 'pending' | 'sent' | 'delivered' | 'failed'
          delivered_at: string | null
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          delivery_status?: 'pending' | 'sent' | 'delivered' | 'failed'
          delivered_at?: string | null
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          delivery_status?: 'pending' | 'sent' | 'delivered' | 'failed'
          delivered_at?: string | null
        }
      }
    }
  }
}
