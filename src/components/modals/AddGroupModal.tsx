import { useState } from 'react'
import { X } from 'lucide-react'

type GroupFormErrors = Partial<Record<keyof GroupData, string>>

interface AddGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (group: GroupData) => void
}

interface GroupData {
  name: string
  description: string
  leader: string
  schedule: string
  location: string
  maxMembers: number
}

const mockLeaders = [
  'Алексей Козлов',
  'Мария Сидорова', 
  'Елена Петрова',
  'Дмитрий Волков',
  'Анна Морозова'
]

const scheduleOptions = [
  'Воскресенье, 09:00',
  'Воскресенье, 11:00', 
  'Воскресенье, 19:00',
  'Суббота, 16:00',
  'Суббота, 18:00',
  'Пятница, 19:00',
  'Среда, 19:00'
]

const locationOptions = [
  'Главный зал',
  'Малый зал',
  'Зал молодежи',
  'Детский зал',
  'Конференц-зал',
  'Библиотека'
]

/**
 * Модалка создания новой группы.
 */
export default function AddGroupModal({ isOpen, onClose, onSave }: AddGroupModalProps) {
  const [formData, setFormData] = useState<GroupData>({
    name: '',
    description: '',
    leader: '',
    schedule: '',
    location: '',
    maxMembers: 20
  })

  const [errors, setErrors] = useState<GroupFormErrors>({})

  const handleInputChange = (field: keyof GroupData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: GroupFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Название группы обязательно'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание группы обязательно'
    }

    if (!formData.leader) {
      newErrors.leader = 'Выберите лидера группы'
    }

    if (!formData.schedule) {
      newErrors.schedule = 'Выберите расписание'
    }

    if (!formData.location) {
      newErrors.location = 'Выберите место проведения'
    }

    if (formData.maxMembers < 1 || formData.maxMembers > 100 || Number.isNaN(formData.maxMembers)) {
      newErrors.maxMembers = 'Количество участников должно быть от 1 до 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
      setFormData({
        name: '',
        description: '',
        leader: '',
        schedule: '',
        location: '',
        maxMembers: 20
      })
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      leader: '',
      schedule: '',
      location: '',
      maxMembers: 20
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Создать новую группу
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Название группы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Название группы *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Например: Молодежное служение"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание группы *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`input w-full h-24 resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Опишите цель и особенности группы..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Лидер группы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Лидер группы *
            </label>
            <select
              value={formData.leader}
              onChange={(e) => handleInputChange('leader', e.target.value)}
              className={`input w-full ${errors.leader ? 'border-red-500' : ''}`}
            >
              <option value="">Выберите лидера</option>
              {mockLeaders.map(leader => (
                <option key={leader} value={leader}>{leader}</option>
              ))}
            </select>
            {errors.leader && (
              <p className="mt-1 text-sm text-red-600">{errors.leader}</p>
            )}
          </div>

          {/* Расписание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Расписание *
            </label>
            <select
              value={formData.schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              className={`input w-full ${errors.schedule ? 'border-red-500' : ''}`}
            >
              <option value="">Выберите расписание</option>
              {scheduleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
            )}
          </div>

          {/* Место проведения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Место проведения *
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`input w-full ${errors.location ? 'border-red-500' : ''}`}
            >
              <option value="">Выберите место проведения</option>
              {locationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Максимальное количество участников */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Максимальное количество участников *
            </label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10)
                handleInputChange('maxMembers', Number.isNaN(parsed) ? 0 : parsed)
              }}
              className={`input w-full ${errors.maxMembers ? 'border-red-500' : ''}`}
              placeholder="Например: 20"
            />
            {errors.maxMembers && (
              <p className="mt-1 text-sm text-red-600">{errors.maxMembers}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Создать группу
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}