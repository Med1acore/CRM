-- === SEED: CRMCHURCH initial data ===
-- Этот файл заполняет базу минимальными начальными данными после миграций

-- Очистим всё на случай, если база уже была
TRUNCATE TABLE workspace_members, workspaces, people, groups, workspace_modules, workspace_settings RESTART IDENTITY CASCADE;

-- === WORKSPACES ===
INSERT INTO workspaces (id, name, created_at)
VALUES 
  (gen_random_uuid(), 'Father’s Home Church', now()),
  (gen_random_uuid(), 'Youth Ministry', now());

-- full_name соответствует схеме, joined_at в people нет
INSERT INTO people (id, workspace_id, full_name, status, created_at)
SELECT 
  gen_random_uuid(), 
  w.id, 
  n.name, 
  'active', 
  now()
FROM workspaces w,
  (VALUES ('John Pastor'), ('Mary Volunteer'), ('Alex Worship Leader'), ('Sara Youth')) AS n(name);

-- === GROUPS ===
INSERT INTO groups (id, workspace_id, name, leader_person_id, capacity, created_at)
SELECT 
  gen_random_uuid(), 
  w.id, 
  g.name, 
  NULL, 
  20, 
  now()
FROM workspaces w,
  (VALUES ('Alpha Group'), ('Prayer Team'), ('Youth Group')) AS g(name);

INSERT INTO workspace_modules (workspace_id, module, enabled, created_at)
SELECT 
  w.id,
  m.module,
  true,
  now()
FROM workspaces w,
  (VALUES 
    ('people'), 
    ('groups'), 
    ('calendar'), 
    ('tasks'), 
    ('analytics'), 
    ('sermons')
  ) AS m(module);

-- === SETTINGS ===
INSERT INTO workspace_settings (workspace_id, timezone, locale, feature_flags)
SELECT 
  w.id, 
  'Europe/Moscow', 
  'ru-RU', 
  '{}'::jsonb
FROM workspaces w;

-- Пропускаем сид участников, т.к. требуется существующий user_id из auth.users

-- Запишем несколько событий в analytics_events (таблица есть в схеме)
INSERT INTO analytics_events (workspace_id, actor_user_id, event_type, value, metadata)
SELECT w.id, NULL::uuid, 'person_created', NULL::numeric, '{}'::jsonb FROM workspaces w
UNION ALL
SELECT w.id, NULL::uuid, 'attendance_marked', NULL::numeric, jsonb_build_object('present', true) FROM workspaces w
UNION ALL
SELECT w.id, NULL::uuid, 'message_sent', 156::numeric, '{}'::jsonb FROM workspaces w;

-- В схеме колонка называется transcript, не content
INSERT INTO sermons (id, workspace_id, title, transcript, created_at)
SELECT 
  gen_random_uuid(),
  w.id,
  'Вера, Надежда, Любовь',
  'Проповедь о вере и пути Церкви к единству.',
  now()
FROM workspaces w;

-- === DONE ===
-- Всё!
-- После выполнения этого файла у тебя будут:
--   - 2 воркспейса
--   - несколько пользователей
--   - 3 группы
--   - базовые модули и настройки
--   - тестовые KPI и проповедь
