import type { FC } from 'react'

interface PeopleHeaderProps {
  total: number
}

/**
 * Renders the page heading with total number of people.
 */
export const PeopleHeader: FC<PeopleHeaderProps> = ({ total }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      Люди и участники
    </h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">
      Управление данными о членах церкви и гостях
      <span className="ml-2 text-sm text-muted-foreground">
        (Всего: {total} пользователей)
      </span>
    </p>
  </div>
)

