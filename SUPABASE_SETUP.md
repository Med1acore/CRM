# Настройка Supabase для ChurchCRM Genesis

Этот документ содержит пошаговые инструкции по настройке Supabase для проекта ChurchCRM Genesis.

## 🚀 Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите в свой аккаунт или создайте новый
3. Нажмите "New Project"
4. Выберите организацию
5. Заполните данные проекта:
   - **Name**: `churchcrm-genesis`
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший регион
6. Нажмите "Create new project"

## 🔧 Шаг 2: Получение ключей API

1. В панели управления Supabase перейдите в **Settings** → **API**
2. Скопируйте следующие значения:
   - **Project URL** (например: `https://your-project.supabase.co`)
   - **anon public** ключ

## 📝 Шаг 3: Настройка переменных окружения

1. Создайте файл `.env.local` в корне проекта
2. Добавьте следующие переменные:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Telegram Bot Configuration (for future use)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# AI Service Configuration (for future use)
VITE_AI_SERVICE_API_KEY=your_ai_service_api_key
```

## 🗄 Шаг 4: Настройка базы данных

1. В панели управления Supabase перейдите в **SQL Editor**
2. Создайте новый запрос
3. Скопируйте и выполните содержимое файла `supabase/schema.sql`
4. После успешного выполнения скопируйте и выполните содержимое файла `supabase/auth-policies.sql`

## 🌱 Шаг 5: Загрузка тестовых данных (опционально)

1. В **SQL Editor** создайте новый запрос
2. Скопируйте и выполните содержимое файла `supabase/seed.sql`

## 🔐 Шаг 6: Настройка аутентификации

1. В панели управления перейдите в **Authentication** → **Settings**
2. Настройте следующие параметры:

### URL Configuration
- **Site URL**: `http://localhost:5173` (для разработки)
- **Redirect URLs**: 
  - `http://localhost:5173/**`
  - `https://your-domain.com/**` (для продакшена)

### Email Settings
- Включите **Enable email confirmations** если нужно
- Настройте шаблоны писем при необходимости

### Provider Settings
- **Enable email provider**: включено по умолчанию
- При необходимости добавьте другие провайдеры (Google, GitHub и т.д.)

## 👥 Шаг 7: Создание тестовых пользователей

### Вариант 1: Через панель управления
1. Перейдите в **Authentication** → **Users**
2. Нажмите "Add user"
3. Создайте пользователей с разными ролями:

**Администратор:**
- Email: `admin@churchcrm.com`
- Password: `admin123`
- User Metadata: `{"role": "admin", "full_name": "Администратор"}`

**Лидер:**
- Email: `leader@churchcrm.com`
- Password: `leader123`
- User Metadata: `{"role": "leader", "full_name": "Лидер группы"}`

**Участник:**
- Email: `member@churchcrm.com`
- Password: `member123`
- User Metadata: `{"role": "member", "full_name": "Участник"}`

### Вариант 2: Через приложение
1. Запустите приложение: `npm run dev`
2. Перейдите на страницу регистрации
3. Создайте пользователей через форму регистрации

## 🧪 Шаг 8: Тестирование подключения

1. Запустите приложение:
```bash
npm run dev
```

2. Откройте браузер и перейдите на `http://localhost:5173`

3. Попробуйте войти с тестовыми учетными данными

4. Проверьте консоль браузера на наличие ошибок

## 🔍 Шаг 9: Проверка базы данных

1. В панели управления Supabase перейдите в **Table Editor**
2. Убедитесь, что все таблицы созданы:
   - `users`
   - `family_connections`
   - `user_tags`
   - `growth_steps`
   - `groups`
   - `group_members`
   - `events`
   - `event_volunteers`
   - `check_ins`
   - `message_templates`
   - `messages`
   - `message_recipients`

3. Проверьте, что тестовые данные загружены (если использовали seed.sql)

## 🚨 Устранение неполадок

### Ошибка "Invalid API key"
- Проверьте правильность `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- Убедитесь, что файл `.env.local` находится в корне проекта

### Ошибка "Row Level Security"
- Убедитесь, что выполнили `supabase/auth-policies.sql`
- Проверьте, что политики безопасности созданы правильно

### Ошибка аутентификации
- Проверьте настройки в **Authentication** → **Settings**
- Убедитесь, что URL-адреса настроены правильно
- Проверьте, что пользователи созданы с правильными метаданными

### Ошибка подключения к базе данных
- Проверьте, что проект Supabase активен
- Убедитесь, что выполнили `supabase/schema.sql`
- Проверьте логи в панели управления Supabase

## 📚 Дополнительные ресурсы

- [Документация Supabase](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🆘 Поддержка

Если у вас возникли проблемы с настройкой, проверьте:
1. Логи в консоли браузера
2. Логи в панели управления Supabase
3. Правильность переменных окружения
4. Выполнение всех SQL-скриптов

---

**ChurchCRM Genesis** - Современное решение для управления церковным сообществом.
