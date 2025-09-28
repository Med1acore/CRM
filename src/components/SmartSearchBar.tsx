import { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, Lightbulb } from 'lucide-react'
import type { Person } from '@/types/person'

interface SmartSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  people: Person[]
}

interface SearchFilters {
  status?: string[]
  tags?: string[]
  name?: string
  email?: string
}

interface SearchSuggestion {
  text: string
  type: 'status' | 'tag' | 'example'
  description?: string
}

export function SmartSearchBar({ onSearch, people }: SmartSearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const inputRef = useRef<HTMLInputElement>(null)

  // Извлекаем уникальные статусы и теги из данных
  const allStatuses = [...new Set(people.map(p => p.status))]
  const allTags = [...new Set(people.flatMap(p => p.tags))]

  // Примеры запросов
  const exampleQueries = [
    'Покажи всех гостей',
    'Найди участников с тегом Музыка',
    'Покажи всех лидеров в Молодежном служении',
    'Найди активных участников с тегами Музыка и Проповедь'
  ]

  // Генерируем подсказки на основе ввода
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([
        ...exampleQueries.map(text => ({ text, type: 'example' as const, description: 'Пример запроса' })),
        ...allStatuses.map(status => ({ text: `Покажи всех ${status}`, type: 'status' as const, description: 'Фильтр по статусу' })),
        ...allTags.slice(0, 5).map(tag => ({ text: `Найди с тегом ${tag}`, type: 'tag' as const, description: 'Фильтр по тегу' }))
      ])
      return
    }

    const newSuggestions: SearchSuggestion[] = []
    const lowerQuery = query.toLowerCase()

    // Подсказки по статусам
    allStatuses.forEach(status => {
      if (status.toLowerCase().includes(lowerQuery)) {
        newSuggestions.push({
          text: `Покажи всех ${status}`,
          type: 'status',
          description: 'Фильтр по статусу'
        })
      }
    })

    // Подсказки по тегам
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        newSuggestions.push({
          text: `Найди с тегом ${tag}`,
          type: 'tag',
          description: 'Фильтр по тегу'
        })
      }
    })

    // Примеры запросов
    exampleQueries.forEach(example => {
      if (example.toLowerCase().includes(lowerQuery)) {
        newSuggestions.push({
          text: example,
          type: 'example',
          description: 'Пример запроса'
        })
      }
    })

    setSuggestions(newSuggestions.slice(0, 8))
  }, [query, allStatuses, allTags])

  // Парсим естественный язык в фильтры
  const parseQuery = (query: string): SearchFilters => {
    const filters: SearchFilters = {}
    const lowerQuery = query.toLowerCase()

    // Поиск по статусам
    allStatuses.forEach(status => {
      if (lowerQuery.includes(status.toLowerCase()) || 
          lowerQuery.includes('гост') && status === 'guest' ||
          lowerQuery.includes('актив') && status === 'active' ||
          lowerQuery.includes('нов') && status === 'new' ||
          lowerQuery.includes('лидер') && status === 'leader') {
        filters.status = [...(filters.status || []), status]
      }
    })

    // Поиск по тегам
    allTags.forEach(tag => {
      if (lowerQuery.includes(tag.toLowerCase()) || 
          lowerQuery.includes('тег') && lowerQuery.includes(tag.toLowerCase())) {
        filters.tags = [...(filters.tags || []), tag]
      }
    })

    // Поиск по имени/email (если не найдены специальные фильтры)
    if (!filters.status && !filters.tags) {
      const words = query.split(' ').filter(word => word.length > 2)
      if (words.length > 0) {
        filters.name = words.join(' ')
      }
    }

    return filters
  }

  const handleSearch = (searchQuery: string = query) => {
    const parsedFilters = parseQuery(searchQuery)
    setFilters(parsedFilters)
    onSearch(searchQuery, parsedFilters)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const clearFilters = () => {
    setFilters({})
    setQuery('')
    onSearch('', {})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
                if (e.key === 'Escape') {
                  setShowSuggestions(false)
                }
              }}
              className="input pl-10 pr-10"
              placeholder="Покажи всех гостей с тегом Музыка..."
            />
            {query && (
              <button
                onClick={() => { setQuery(''); handleSearch('') }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Подсказки */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {suggestion.type === 'example' && <Lightbulb className="h-4 w-4 text-yellow-500" />}
                    {suggestion.type === 'status' && <Filter className="h-4 w-4 text-blue-500" />}
                    {suggestion.type === 'tag' && <Filter className="h-4 w-4 text-green-500" />}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.text}
                      </div>
                      {suggestion.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleSearch()}
          className="btn btn-primary px-4"
        >
          <Search className="h-4 w-4" />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary px-4"
            title="Очистить фильтры"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.status?.map(status => (
            <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm">
              Статус: {status}
              <button
                onClick={() => {
                  const newFilters = { ...filters }
                  newFilters.status = newFilters.status?.filter(s => s !== status)
                  if (newFilters.status?.length === 0) delete newFilters.status
                  setFilters(newFilters)
                  onSearch(query, newFilters)
                }}
                className="hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.tags?.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm">
              Тег: {tag}
              <button
                onClick={() => {
                  const newFilters = { ...filters }
                  newFilters.tags = newFilters.tags?.filter(t => t !== tag)
                  if (newFilters.tags?.length === 0) delete newFilters.tags
                  setFilters(newFilters)
                  onSearch(query, newFilters)
                }}
                className="hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.name && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm">
              Поиск: {filters.name}
              <button
                onClick={() => {
                  const newFilters = { ...filters }
                  delete newFilters.name
                  setFilters(newFilters)
                  onSearch(query, newFilters)
                }}
                className="hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
