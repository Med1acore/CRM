import { useState, useEffect } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { AddUserModal, PeopleGrid, PeopleTable, ViewToggle, SmartSearchBar } from '../components'
import type { Person } from '@/types/person'
import toast from 'react-hot-toast'

interface User {
  id: string
  full_name: string
  email: string
  phone?: string
  date_of_birth?: string
  status: string
  tags: string[]
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

const initialUsers: User[] = [
  {
    id: '1',
    full_name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    status: 'active_member',
    tags: ['Молодежное служение', 'Музыка'],
    avatar_url: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    full_name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    status: 'new_member',
    tags: ['Детское служение'],
    avatar_url: null,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    full_name: 'Алексей Козлов',
    email: 'alexey@example.com',
    phone: '+7 (999) 345-67-89',
    status: 'minister',
    tags: ['Лидерство', 'Проповедь'],
    avatar_url: null,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
]

interface SearchFilters {
  status?: string[]
  tags?: string[]
  name?: string
  email?: string
}

export default function PeopleHub() {
  // Загружаем пользователей из localStorage или используем начальные данные
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('crm-users')
      return saved ? JSON.parse(saved) : initialUsers
    } catch (error) {
      console.error('Ошибка загрузки пользователей из localStorage:', error)
      return initialUsers
    }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [smartFilters, setSmartFilters] = useState<SearchFilters>({})

  // Сохраняем пользователей в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('crm-users', JSON.stringify(users))
    } catch (error) {
      console.error('Ошибка сохранения пользователей в localStorage:', error)
    }
  }, [users])

  const filteredUsers = users.filter(user => {
    // Старый поиск (для совместимости)
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

    // Умный поиск
    let matchesSmartFilters = true
    
    if (smartFilters.status && smartFilters.status.length > 0) {
      const userStatus = user.status === 'active_member' ? 'active' : 
                        user.status === 'new_member' ? 'new' : 
                        user.status === 'minister' ? 'leader' : 'guest'
      matchesSmartFilters = matchesSmartFilters && smartFilters.status.includes(userStatus)
    }
    
    if (smartFilters.tags && smartFilters.tags.length > 0) {
      matchesSmartFilters = matchesSmartFilters && 
        smartFilters.tags.some(tag => user.tags.includes(tag))
    }
    
    if (smartFilters.name) {
      matchesSmartFilters = matchesSmartFilters && 
        user.full_name.toLowerCase().includes(smartFilters.name.toLowerCase())
    }
    
    if (smartFilters.email) {
      matchesSmartFilters = matchesSmartFilters && 
        user.email.toLowerCase().includes(smartFilters.email.toLowerCase())
    }

    // Если есть умные фильтры, используем их, иначе старые
    const hasSmartFilters = Object.keys(smartFilters).length > 0
    return hasSmartFilters ? matchesSmartFilters : (matchesSearch && matchesStatus)
  })

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev])
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success('Пользователь удален')
    }
  }

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId) || null
    if (user) {
      setEditUser(user)
      setIsAddModalOpen(true)
    }
  }

  const handleSaveEdit = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
  }

  const handleSmartSearch = (_query: string, filters: SearchFilters) => {
    setSmartFilters(filters)
  }

  // Функция для сброса данных (для отладки)
  const resetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные пользователей?')) {
      setUsers(initialUsers)
      localStorage.removeItem('crm-users')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Люди и участники
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Управление данными о членах церкви и гостях
            <span className="ml-2 text-sm text-muted-foreground">
              (Всего: {users.length} пользователей)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <button
            onClick={resetData}
            className="btn btn-secondary"
            title="Сбросить данные (для отладки)"
          >
            Сброс
          </button>
          <button 
            onClick={() => {
              setEditUser(null) // Ensure we're in add mode
              setIsAddModalOpen(true)
            }}
            className="btn btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить участника
          </button>
        </div>
      </div>

      {/* Smart Search */}
      <div className="card p-6 relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Умный поиск
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Попробуйте: "Покажи всех гостей с тегом Музыка" или "Найди активных участников"
          </p>
        </div>
        <SmartSearchBar 
          onSearch={handleSmartSearch} 
          people={(() => {
            const people: Person[] = users.map((u) => ({
              id: u.id,
              fullName: u.full_name,
              email: u.email,
              phone: u.phone || '',
              status: (u.status === 'active_member' ? 'active' : u.status === 'new_member' ? 'new' : u.status === 'minister' ? 'leader' : 'guest'),
              tags: u.tags || [],
            }))
            return people
          })()}
        />
      </div>

      {/* Legacy Filters (скрыты, но оставлены для совместимости) */}
      <div className="card p-6" style={{ display: 'none' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="all">Все статусы</option>
              <option value="guest">Гости</option>
              <option value="new_member">Новые участники</option>
              <option value="active_member">Активные участники</option>
              <option value="minister">Служители</option>
              <option value="left">Покинувшие</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users: Grid or List */}
      <div className="relative z-0">
        {(() => {
          const people: Person[] = filteredUsers.map((u) => ({
            id: u.id,
            fullName: u.full_name,
            email: u.email,
            phone: u.phone || '',
            status: (u.status === 'active_member' ? 'active' : u.status === 'new_member' ? 'new' : u.status === 'minister' ? 'leader' : 'guest'),
            tags: u.tags || [],
          }))

          return viewMode === 'grid' ? (
            <PeopleGrid people={people} onEdit={handleEditUser} onDelete={handleDeleteUser} />
          ) : (
            <PeopleTable people={people} />
          )
        })()}
      </div> 

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Участники не найдены
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditUser(null) }}
        onAddUser={handleAddUser}
        mode={editUser ? 'edit' : 'add'}
        initialUser={editUser}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  )
}
