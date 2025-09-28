import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'

type User = Database['public']['Tables']['users']['Row']

export function SupabaseTest() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (!supabase) {
      setConnectionStatus('disconnected')
      setError('Supabase client не инициализирован')
      return
    }

    try {
      // Простая проверка подключения
      const { error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        setConnectionStatus('disconnected')
        setError(`Ошибка подключения: ${error.message}`)
      } else {
        setConnectionStatus('connected')
        setError(null)
      }
    } catch (err) {
      setConnectionStatus('disconnected')
      setError(`Ошибка: ${err}`)
    }
  }

  const fetchUsers = async () => {
    if (!supabase) {
      setError('Supabase client не инициализирован')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(10)

      if (error) {
        setError(`Ошибка загрузки пользователей: ${error.message}`)
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      setError(`Ошибка: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Подключено'
      case 'disconnected':
        return 'Отключено'
      default:
        return 'Проверка...'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Тест подключения к Supabase</h2>
      
      {/* Статус подключения */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Статус подключения:</span>
          <span className={`font-bold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Кнопки управления */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={checkConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Проверить подключение
        </button>
        
        <button
          onClick={fetchUsers}
          disabled={loading || connectionStatus !== 'connected'}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Загрузка...' : 'Загрузить пользователей'}
        </button>
      </div>

      {/* Информация о переменных окружения */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Переменные окружения:</h3>
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">VITE_SUPABASE_URL:</span>{' '}
            <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_URL ? 'Настроено' : 'Не настроено'}
            </span>
          </div>
          <div>
            <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span>{' '}
            <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Настроено' : 'Не настроено'}
            </span>
          </div>
        </div>
      </div>

      {/* Список пользователей */}
      {users.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Пользователи ({users.length}):</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="p-2 bg-gray-50 rounded border">
                <div className="font-medium">{user.full_name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-500">Статус: {user.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Инструкции */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-medium text-blue-800 mb-2">Инструкции по настройке:</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Создайте проект в Supabase</li>
          <li>Скопируйте URL и anon key из настроек проекта</li>
          <li>Создайте файл .env.local с переменными VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY</li>
          <li>Выполните SQL-скрипты из папки supabase/</li>
          <li>Перезапустите приложение</li>
        </ol>
      </div>
    </div>
  )
}
