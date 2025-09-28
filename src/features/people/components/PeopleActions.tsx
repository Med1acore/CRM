import type { FC } from 'react'
import type { ViewMode } from '../types/user'
import { ViewToggle } from '@/components'
import { Plus } from 'lucide-react'

interface PeopleActionsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onReset: () => void
  onAdd: () => void
}

/**
 * Displays view toggle, reset and add action buttons for the people page.
 */
export const PeopleActions: FC<PeopleActionsProps> = ({
  viewMode,
  onViewModeChange,
  onReset,
  onAdd,
}) => (
  <div className="flex items-center gap-3">
    <ViewToggle viewMode={viewMode} setViewMode={onViewModeChange} />
    <button
      onClick={onReset}
      className="btn btn-secondary"
      title="Сбросить данные (для отладки)"
    >
      Сброс
    </button>
    <button
      onClick={onAdd}
      className="btn btn-primary"
    >
      <Plus className="mr-2 h-4 w-4" />
      Добавить участника
    </button>
  </div>
)

