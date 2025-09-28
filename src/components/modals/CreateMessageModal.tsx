import { useState } from 'react'
import { X, Send, Users, Calendar, Bot, FileText } from 'lucide-react'

interface CreateMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (message: MessageData) => void
}

interface MessageData {
  title: string
  content: string
  recipients: string[]
  type: 'newsletter' | 'reminder' | 'invitation' | 'announcement'
  scheduleType: 'now' | 'scheduled'
  scheduledDate?: string
  scheduledTime?: string
}

type MessageErrors = Partial<Record<keyof MessageData, string>>

const recipientGroups = [
  { id: 'all', name: 'Все участники', count: 156 },
  { id: 'leaders', name: 'Лидеры групп', count: 8 },
  { id: 'youth', name: 'Молодежное служение', count: 23 },
  { id: 'families', name: 'Семейные группы', count: 45 },
  { id: 'children', name: 'Детское служение', count: 32 },
  { id: 'newcomers', name: 'Новые участники', count: 12 }
]

const messageTypes = [
  { id: 'newsletter', name: 'Еженедельные новости', icon: FileText },
  { id: 'reminder', name: 'Напоминание', icon: Calendar },
  { id: 'invitation', name: 'Приглашение', icon: Users },
  { id: 'announcement', name: 'Объявление', icon: Send }
]

/**
 * Modal for composing or scheduling broadcast messages.
 */
export default function CreateMessageModal({ isOpen, onClose, onSave }: CreateMessageModalProps) {
  const [formData, setFormData] = useState<MessageData>({
    title: '',
    content: '',
    recipients: [],
    type: 'newsletter',
    scheduleType: 'now'
  })

  const [errors, setErrors] = useState<MessageErrors>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (field: keyof MessageData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleRecipientToggle = (recipientId: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(recipientId)
        ? prev.recipients.filter(id => id !== recipientId)
        : [...prev.recipients, recipientId]
    }))
  }

  const generateWithAI = async () => {
    setIsGenerating(true)
    // Имитация работы ИИ
    setTimeout(() => {
      const aiGeneratedContent = {
        title: 'Еженедельные новости церкви',
        content: `Дорогие друзья!

Приглашаем вас на воскресное богослужение в 11:00.

📅 Предстоящие события:
• Молодежная встреча - воскресенье, 19:00
• Семейный день - суббота, 16:00
• Детское служение - воскресенье, 11:00

🙏 Молитвенные нужды:
• Здоровье наших служителей
• Молодые семьи в церкви
• Миссионерские проекты

Благословений вам!
Команда церкви`
      }
      
      setFormData(prev => ({
        ...prev,
        title: aiGeneratedContent.title,
        content: aiGeneratedContent.content
      }))
      setIsGenerating(false)
    }, 2000)
  }

  const validateForm = (): boolean => {
    const newErrors: MessageErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок сообщения обязателен'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Содержание сообщения обязательно'
    }

    if (formData.recipients.length === 0) {
      newErrors.recipients = 'Выберите получателей'
    }

    if (formData.scheduleType === 'scheduled') {
      if (!formData.scheduledDate) {
        newErrors.scheduledDate = 'Выберите дату отправки'
      }
      if (!formData.scheduledTime) {
        newErrors.scheduledTime = 'Выберите время отправки'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
      setFormData({
        title: '',
        content: '',
        recipients: [],
        type: 'newsletter',
        scheduleType: 'now'
      })
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      recipients: [],
      type: 'newsletter',
      scheduleType: 'now'
    })
    setErrors({})
    onClose()
  }

  const getTotalRecipients = () => {
    return recipientGroups
      .filter((group) => formData.recipients.includes(group.id))
      .reduce((total, group) => total + group.count, 0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Создать сообщение
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Тип сообщения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Тип сообщения
            </label>
            <div className="grid grid-cols-2 gap-3">
              {messageTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleInputChange('type', type.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    formData.type === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <type.icon className="h-5 w-5 text-primary-600 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Заголовок */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Заголовок сообщения *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Введите заголовок сообщения"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Содержание */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Содержание сообщения *
              </label>
              <button
                type="button"
                onClick={generateWithAI}
                disabled={isGenerating}
                className="btn btn-secondary text-sm"
              >
                <Bot className="mr-1 h-4 w-4" />
                {isGenerating ? 'Генерирую...' : 'Создать с ИИ'}
              </button>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`input w-full h-32 resize-none ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Введите содержание сообщения..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Получатели */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Получатели *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {recipientGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleRecipientToggle(group.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    formData.recipients.includes(group.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {group.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {group.count} человек
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
            {formData.recipients.length > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Всего получателей: <span className="font-semibold">{getTotalRecipients()}</span>
              </p>
            )}
            {errors.recipients && (
              <p className="mt-1 text-sm text-red-600">{errors.recipients}</p>
            )}
          </div>

          {/* Расписание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Когда отправить
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  value="now"
                  checked={formData.scheduleType === 'now'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-900 dark:text-gray-100">Отправить сейчас</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  value="scheduled"
                  checked={formData.scheduleType === 'scheduled'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-900 dark:text-gray-100">Запланировать отправку</span>
              </label>
            </div>

            {formData.scheduleType === 'scheduled' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`input w-full ${errors.scheduledDate ? 'border-red-500' : ''}`}
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Время
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime || ''}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className={`input w-full ${errors.scheduledTime ? 'border-red-500' : ''}`}
                  />
                  {errors.scheduledTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Send className="mr-2 h-4 w-4" />
              {formData.scheduleType === 'now' ? 'Отправить сейчас' : 'Запланировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
