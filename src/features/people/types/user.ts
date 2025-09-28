export type UserStatus = 'guest' | 'new_member' | 'active_member' | 'minister' | 'left'

export interface User {
  id: string
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  status: UserStatus
  tags: string[]
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export type ViewMode = 'grid' | 'list'

export interface SearchFilters {
  status?: string[]
  tags?: string[]
  name?: string
  email?: string
}

