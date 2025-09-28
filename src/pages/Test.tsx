import { SupabaseTest } from '../components/SupabaseTest'

export default function Test() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎉 ChurchCRM Genesis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Система успешно запущена!
          </p>
        </div>

        {/* Тест подключения к Supabase */}
        <div className="mb-8">
          <SupabaseTest />
        </div>

        {/* Тестовые данные для входа */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Тестовые данные для входа:
          </h2>
          <div className="text-left space-y-2 mb-4">
            <p><strong>Email:</strong> admin@test.com</p>
            <p><strong>Пароль:</strong> password</p>
          </div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Перейти к входу
          </button>
        </div>
      </div>
    </div>
  )
}
