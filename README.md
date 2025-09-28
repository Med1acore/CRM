# ChurchCRM Genesis

Современная CRM-система для церковной организации, разработанная с использованием React, TypeScript и Supabase.

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

1. Скачайте и распакуйте проект в нужную папку

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
cp env.example .env.local
```

Заполните файл `.env.local` вашими данными Supabase:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Запустите проект в режиме разработки:
```bash
npm run dev
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

Для разработки новых функций:
1. Создайте копию проекта
2. Внесите необходимые изменения
3. Протестируйте функциональность
4. Соберите проект для продакшена

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для получения дополнительной информации.

## 📞 Поддержка

Если у вас есть вопросы или предложения, свяжитесь с командой разработки.

---

**ChurchCRM Genesis** - Современное решение для управления церковным сообществом.
