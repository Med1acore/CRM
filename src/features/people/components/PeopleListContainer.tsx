import type { FC } from 'react'
import type { Person } from '@/types/person'
import { PeopleGrid, PeopleTable } from '@/components'
import type { ViewMode } from '../types/user'

interface PeopleListContainerProps {
  people: Person[]
  viewMode: ViewMode
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Renders people either in grid or table view depending on current mode.
 */
export const PeopleListContainer: FC<PeopleListContainerProps> = ({ people, viewMode, onEdit, onDelete }) => (
  <div className="relative z-0">
    {viewMode === 'grid' ? (
      <PeopleGrid people={people} onEdit={onEdit} onDelete={onDelete} />
    ) : (
      <PeopleTable people={people} />
    )}
  </div>
)

