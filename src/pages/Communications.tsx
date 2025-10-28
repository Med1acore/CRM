import { useState, useEffect } from 'react';
import { Plus, Send, Clock, Users, MessageSquare, Bot, Eye, Copy, Trash2 } from 'lucide-react';
import { CreateMessageModal } from '../components/modals';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  title: string;
  content: string;
  recipients_count: number;
  sent_at?: string;
  scheduled_at?: string;
  status: 'sent' | 'scheduled' | 'failed';
  type: 'newsletter' | 'reminder' | 'invitation' | 'announcement';
  createdAt: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    title: 'Еженедельные новости',
    content: 'Дорогие друзья! Приглашаем вас на воскресное богослужение...',
    recipients_count: 156,
    sent_at: '2025-01-24T10:00:00',
    status: 'sent',
    type: 'newsletter',
    createdAt: '2025-01-24T09:30:00',
  },
  {
    id: '2',
    title: 'Напоминание о молодежной встрече',
    content: 'Не забудьте о встрече молодежного служения завтра в 19:00...',
    recipients_count: 23,
    sent_at: '2025-01-25T18:00:00',
    status: 'sent',
    type: 'reminder',
    createdAt: '2025-01-25T17:30:00',
  },
  {
    id: '3',
    title: 'Приглашение на семейный день',
    content: 'Приглашаем все семьи на специальное мероприятие...',
    recipients_count: 89,
    scheduled_at: '2025-02-01T09:00:00',
    status: 'scheduled',
    type: 'invitation',
    createdAt: '2025-01-30T14:00:00',
  },
];

const mockTemplates = [
  {
    id: '1',
    name: 'Еженедельные новости',
    content: 'Дорогие друзья! {{greeting}} Приглашаем вас на {{event_name}}...',
    variables: ['greeting', 'event_name'],
    usage_count: 12,
  },
  {
    id: '2',
    name: 'Напоминание о событии',
    content: 'Напоминаем о предстоящем событии {{event_name}} {{event_date}}...',
    variables: ['event_name', 'event_date'],
    usage_count: 8,
  },
  {
    id: '3',
    name: 'Приглашение в группу',
    content: 'Приглашаем вас присоединиться к группе {{group_name}}...',
    variables: ['group_name', 'leader_name'],
    usage_count: 5,
  },
];

export default function Communications() {
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'ai-assistant'>('messages');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedMessages = localStorage.getItem('church-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('church-messages', JSON.stringify(messages));
  }, [messages]);

  const handleCreateMessage = (messageData: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      ...messageData,
      status: messageData.scheduleType === 'now' ? 'sent' : 'scheduled',
      sent_at: messageData.scheduleType === 'now' ? new Date().toISOString() : undefined,
      scheduled_at:
        messageData.scheduleType === 'scheduled'
          ? `${messageData.scheduledDate}T${messageData.scheduledTime}:00`
          : undefined,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [newMessage, ...prev]);
    toast.success(
      messageData.scheduleType === 'now' ? 'Сообщение отправлено!' : 'Сообщение запланировано!'
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
      toast.success('Сообщение удалено!');
    }
  };

  const handleDuplicateMessage = (message: Message) => {
    const duplicatedMessage: Message = {
      ...message,
      id: Date.now().toString(),
      status: 'scheduled',
      sent_at: undefined,
      scheduled_at: undefined,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [duplicatedMessage, ...prev]);
    toast.success('Сообщение продублировано!');
  };

  const handleSendNow = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              status: 'sent',
              sent_at: new Date().toISOString(),
              scheduled_at: undefined,
            }
          : message
      )
    );
    toast.success('Сообщение отправлено!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Отправлено';
      case 'scheduled':
        return 'Запланировано';
      case 'failed':
        return 'Ошибка';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Коммуникации</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Управление рассылками и уведомлениями
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Создать сообщение
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', name: 'Сообщения', icon: MessageSquare },
            { id: 'templates', name: 'Шаблоны', icon: Send },
            { id: 'ai-assistant', name: 'ИИ-ассистент', icon: Bot },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {message.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {message.content}
                  </p>

                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{message.recipients_count} получателей</span>
                    </div>
                    <div className="flex items-center">
                      {message.sent_at ? (
                        <>
                          <Send className="mr-1 h-4 w-4" />
                          <span>Отправлено: {formatDate(message.sent_at)}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-4 w-4" />
                          <span>Запланировано: {formatDate(message.scheduled_at!)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}
                  >
                    {getStatusLabel(message.status)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button className="btn btn-secondary text-sm">
                  <Eye className="mr-1 h-4 w-4" />
                  Просмотреть
                </button>
                <button
                  onClick={() => handleDuplicateMessage(message)}
                  className="btn btn-secondary text-sm"
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Дублировать
                </button>
                {message.status === 'scheduled' && (
                  <button
                    onClick={() => handleSendNow(message.id)}
                    className="btn btn-primary text-sm"
                  >
                    <Send className="mr-1 h-4 w-4" />
                    Отправить сейчас
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="btn btn-danger text-sm"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {mockTemplates.map((template) => (
            <div key={template.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    {template.content}
                  </p>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded"
                        >
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Использовано: {template.usage_count} раз
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button className="btn btn-primary text-sm">Использовать</button>
                <button className="btn btn-secondary text-sm">Редактировать</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Assistant Tab */}
      {activeTab === 'ai-assistant' && (
        <div className="card p-6">
          <div className="text-center">
            <Bot className="mx-auto h-12 w-12 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              ИИ-ассистент для генерации текста
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Используйте искусственный интеллект для создания персонализированных сообщений
            </p>

            <div className="mt-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Осталось использований в этом месяце:{' '}
                  <span className="font-semibold">47 из 100</span>
                </p>
              </div>

              <button className="btn btn-primary">
                <Bot className="mr-2 h-4 w-4" />
                Создать сообщение с ИИ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания сообщения */}
      <CreateMessageModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateMessage}
      />
    </div>
  );
}
