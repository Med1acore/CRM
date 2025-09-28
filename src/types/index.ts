export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  telegram?: string
  date_of_birth?: string
  status: UserStatus
  family_connections?: FamilyConnection[]
  tags: string[]
  growth_path: GrowthStep[]
  created_at: string
  updated_at: string
}

export type UserStatus = 
  | 'guest' 
  | 'new_member' 
  | 'active_member' 
  | 'minister' 
  | 'left'

export interface FamilyConnection {
  id: string
  user_id: string
  related_user_id: string
  relationship_type: 'spouse' | 'parent' | 'child' | 'sibling'
  created_at: string
}

export interface GrowthStep {
  id: string
  user_id: string
  step_type: string
  title: string
  description?: string
  completed_at?: string
  created_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  leader_id: string
  members: GroupMember[]
  schedule?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'leader' | 'member'
  joined_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  organizer_id: string
  volunteers: EventVolunteer[]
  qr_code?: string
  check_ins: CheckIn[]
  created_at: string
  updated_at: string
}

export interface EventVolunteer {
  id: string
  event_id: string
  user_id: string
  role: string
  assigned_at: string
}

export interface CheckIn {
  id: string
  event_id: string
  user_id: string
  checked_in_at: string
}

export interface Message {
  id: string
  title: string
  content: string
  template_id?: string
  sender_id: string
  recipients: MessageRecipient[]
  scheduled_at?: string
  sent_at?: string
  created_at: string
}

export interface MessageRecipient {
  id: string
  message_id: string
  user_id: string
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed'
  delivered_at?: string
}

export interface MessageTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  created_at: string
  updated_at: string
}

export interface AnalyticsData {
  attendance: {
    total: number
    adults: number
    children: number
    guests: number
    trend: number[]
  }
  membership: {
    total: number
    new_members: number
    growth_rate: number
    trend: number[]
  }
  engagement: {
    funnel: {
      guests: number
      new_members: number
      active_members: number
      ministers: number
    }
  }
}

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'leader' | 'member'
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}
