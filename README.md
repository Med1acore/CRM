# ChurchCRM Genesis

![CI](https://github.com/YOUR_USERNAME/CRMCHURCH/workflows/CI/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/CRMCHURCH/workflows/CodeQL%20Security%20Scan/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-blue)

Современная CRM-система для церковной организации, разработанная с использованием React, TypeScript и Supabase.

> **Note**: For English documentation, see [README.en.md](README.en.md) (coming soon)

## 🚀 Возможности

### Модули системы:
- **People Hub** - Управление участниками и гостями!
- **Groups Hub** - Управление малыми группами и служениями
- **Events & Schedule** - Календарь событий и планирование
- **Communications Hub** - Рассылки и уведомления
- **Analytics & Insights** - Аналитика и отчеты

### Ключевые функции:
- ✅ Современный адаптивный интерфейс
- ✅ Темная/светлая тема
- ✅ Система аутентификации
- ✅ Ролевая модель доступа
- ✅ Интерактивные дашборды
- ✅ QR-коды для регистрации на события
- 🔄 Интеграция с Telegram (в разработке)
- 🔄 ИИ-ассистент для генерации текста (в разработке)

## 🛠 Технологический стек

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

## 📦 Установка

### Требования
- Node.js 18+ или 20+
- npm или pnpm
- Supabase аккаунт (или локальный Supabase через Docker)

### Шаги установки

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/YOUR_USERNAME/CRMCHURCH.git
cd CRMCHURCH
```

2. **Установите зависимости**
```bash
npm install
# или
pnpm install
```

3. **Настройте переменные окружения**
```bash
cp env.example .env.local
```

Заполните файл `.env.local` вашими данными Supabase:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Настройте базу данных**

Выполните SQL-скрипты в Supabase SQL Editor:
```bash
# 1. Схема базы данных
supabase/schema.sql
# 2. Политики безопасности
supabase/auth-policies.sql
# 3. (Опционально) Тестовые данные
supabase/seed.sql
```

5. **Запустите проект**
```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5177`

### Локальная разработка с Supabase

Для локальной разработки без облачного Supabase:

```bash
# Установите Supabase CLI
# Windows (PowerShell):
iwr -useb https://supabase.com/cli/install/windows | iex

# Инициализация
supabase init

# Запуск локального стека
supabase start

# Studio будет доступна по адресу http://localhost:54323
```

## 🗄 Настройка базы данных

Для настройки базы данных Supabase выполните следующие SQL-запросы:

```sql
-- Создание таблицы пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  telegram TEXT,
  date_of_birth DATE,
  status TEXT DEFAULT 'guest' CHECK (status IN ('guest', 'new_member', 'active_member', 'minister', 'left')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы групп
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы событий
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  organizer_id UUID REFERENCES users(id),
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

## 🚀 Развертывание

### Развертывание
1. Соберите проект: `npm run build`
2. Загрузите содержимое папки `dist` на ваш веб-сервер
3. Настройте переменные окружения на сервере

## 📱 Мобильная версия

Система полностью адаптивна и оптимизирована для мобильных устройств. Все функции доступны на смартфонах и планшетах.

## 🔐 Безопасность

- Аутентификация через Supabase Auth
- Ролевая модель доступа (RBAC)
- Row Level Security в базе данных
- HTTPS для всех соединений
- Валидация данных на клиенте и сервере

## 🤝 Разработка

### Доступные команды
```bash
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для production
npm run preview      # Предпросмотр production-сборки
npm run lint         # Проверка кода ESLint
npm run lint:fix     # Автоисправление ESLint
npm run format       # Форматирование кода Prettier
npm run format:check # Проверка форматирования
npm run typecheck    # Проверка типов TypeScript
```

### Структура проекта
```
src/
├── app/          # Инициализация приложения (будущее)
├── pages/        # Страницы приложения
├── features/     # Бизнес-логика и функции
├── entities/     # Бизнес-модели
├── components/   # Общие компоненты
├── contexts/     # React Context
├── hooks/        # Custom hooks
├── lib/          # Утилиты и библиотеки
└── types/        # TypeScript типы
```

### Правила разработки
1. Используйте TypeScript для всего кода
2. Следуйте ESLint и Prettier правилам
3. Пишите понятные commit-сообщения (conventional commits)
4. Добавляйте тесты для новой функциональности
5. Обновляйте документацию при необходимости

Подробнее см. [CONTRIBUTING.md](CONTRIBUTING.md)

## 🛡️ Безопасность

Пожалуйста, ознакомьтесь с нашей [Политикой безопасности](SECURITY.md) для информации о том, как сообщать об уязвимостях.

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для получения дополнительной информации.

## 🤝 Вклад

Мы приветствуем вклад сообщества! См. [CONTRIBUTING.md](CONTRIBUTING.md) для получения инструкций.

## 📞 Поддержка

- 📖 [Документация](docs/)
- 🐛 [Сообщить об ошибке](https://github.com/YOUR_USERNAME/CRMCHURCH/issues)
- 💡 [Предложить функцию](https://github.com/YOUR_USERNAME/CRMCHURCH/issues/new)
- 💬 [Обсуждения](https://github.com/YOUR_USERNAME/CRMCHURCH/discussions)

---

**ChurchCRM Genesis** - Современное решение для управления церковным сообществом.
