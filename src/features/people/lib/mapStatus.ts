import type { UserStatus } from '../types/user'
import type { PersonStatus } from '@/types/person'

const statusMap: Record<UserStatus, PersonStatus> = {
  guest: 'guest',
  new_member: 'new',
  active_member: 'active',
  minister: 'leader',
  left: 'guest',
}

export function mapUserToPersonStatus(status: UserStatus): PersonStatus {
  return statusMap[status] ?? 'guest'
}

export function formatStatusLabel(status: UserStatus): string {
  const labels: Record<UserStatus, string> = {
    guest: 'Гость',
    new_member: 'Новый участник',
    active_member: 'Активный участник',
    minister: 'Служитель',
    left: 'Покинувший',
  }
  return labels[status]
}

