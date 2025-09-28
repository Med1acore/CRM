import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Calendar, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onAddUser?: (user: any) => void
  mode?: 'add' | 'edit'
  initialUser?: any | null
  onSaveEdit?: (user: any) => void
}

export default function AddUserModal({ isOpen, onClose, onAddUser, mode = 'add', initialUser = null, onSaveEdit }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    status: 'guest',
    tags: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (mode === 'edit' && initialUser) {
        const updatedUser = {
          ...initialUser,
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          updated_at: new Date().toISOString()
        }
        onSaveEdit && onSaveEdit(updatedUser)
        toast.success('Изменения сохранены')
      } else {
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        onAddUser && onAddUser(newUser)
        toast.success('Пользователь успешно добавлен!')
      }
      onClose()
      
      // Сброс формы
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        status: 'guest',
        tags: ''
      })
    } catch (error) {
      toast.error('Ошибка при добавлении пользователя')
    } finally {
      setIsLoading(false)
    }
  }

  // Проставляем данные при открытии в режиме редактирования
  useEffect(() => {
    if (isOpen && mode === 'edit' && initialUser) {
      setFormData({
        full_name: initialUser.full_name || '',
        email: initialUser.email || '',
        phone: initialUser.phone || '',
        date_of_birth: initialUser.date_of_birth || '',
        status: initialUser.status || 'guest',
        tags: Array.isArray(initialUser.tags) ? initialUser.tags.join(', ') : (initialUser.tags || '')
      })
    }
  }, [isOpen, mode, initialUser])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {mode === 'edit' ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Полное имя *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input pl-10"
                  placeholder="Введите полное имя"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10"
                  placeholder="Введите email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input pl-10"
                  placeholder="Введите номер телефона"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата рождения
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
              >
                <option value="guest">Гость</option>
                <option value="new_member">Новый участник</option>
                <option value="active_member">Активный участник</option>
                <option value="minister">Служитель</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Теги (через запятую)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input pl-10"
                  placeholder="Молодежное служение, Музыка"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? (mode === 'edit' ? 'Сохранение...' : 'Добавление...') : (mode === 'edit' ? 'Сохранить' : 'Добавить')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
