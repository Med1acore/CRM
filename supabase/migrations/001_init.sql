-- Роли, воркспейсы, модули
-- Роли ровно как ты просишь
drop type if exists role cascade;
create type role as enum ('leader','admin','owner');

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);


create table workspace_members (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role role not null default 'leader',
  primary key (workspace_id, user_id),
  created_at timestamptz default now()
);

-- Модули, включая "sermons"
create table workspace_modules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  module text not null check (module in ('people', 'groups', 'calendar', 'tasks', 'communications', 'analytics', 'sermons')),
  enabled boolean not null default true,
  created_at timestamptz default now()
);


create table workspace_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  timezone text default 'Europe/Moscow',
  locale text default 'ru-RU',
  feature_flags jsonb default '{}',
  created_at timestamptz default now()
);


-- Люди, группы, события, задачи, коммуникации
create table people (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  status text default 'active',
  tags text[],
  created_at timestamptz default now()
);


create table groups (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  leader_person_id uuid references people(id),
  capacity int,
  schedule text,
  room text,
  active boolean default true,
  created_at timestamptz default now()
);


create table group_members (
  group_id uuid references groups(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  role text default 'member',           -- member|assistant|leader
  joined_at date default now(),
  left_at date,
  primary key (group_id, person_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  group_id uuid references groups(id),
  created_at timestamptz default now()
);

-- Посещения событиями (для точной аналитики)
create table attendances (
  id bigserial primary key,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  present boolean not null default true,
  marked_by uuid references auth.users(id),
  occurred_at timestamptz not null default now()
);

-- Доски/задачи
create table task_boards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create type task_status as enum ('todo','in_progress','done');

create table tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  board_id uuid references task_boards(id) on delete cascade,
  title text not null,
  description text,
  status task_status default 'todo',
  assignee_person_id uuid references people(id),
  due_date date,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Рассылки
create table communications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  body text not null,
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipients_count int default 0,
  channel text check (channel in ('email','sms','push')) default 'email',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Проповеди (отдельный модуль)
create table sermons (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  preacher text,
  delivered_at timestamptz,
  transcript text,            -- сам текст проповеди
  analysis jsonb,             -- результаты AI-анализа (персонажи/роли/заметки)
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Аналитика, долгосрочное хранение, инсайты
-- Сырые события (логировать всё ключевое)
create table analytics_events (
  id bigserial primary key,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  person_id uuid references people(id),
  group_id uuid references groups(id),
  event_id uuid references events(id),
  event_type text not null,           -- 'person_created','attendance_marked','group_joined','group_left','task_done','message_sent', ...
  value numeric,                       -- опционально
  metadata jsonb default '{}',
  occurred_at timestamptz not null default now()
);
create index on analytics_events (workspace_id, occurred_at);
create index on analytics_events (workspace_id, event_type, occurred_at);

-- История статусов людей (чтобы видеть «пришёл/отвалился» корректно)
create table people_status_history (
  id bigserial primary key,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  person_id uuid not null references people(id) on delete cascade,
  status text not null,                -- active|inactive|guest
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users(id)
);
create index on people_status_history (workspace_id, person_id, changed_at);

-- Материализованные вьюхи (быстрые графики)
-- KPI по месяцам (нарастающий итог легко добрать на стороне запроса)
create materialized view mv_kpis_monthly as
select
  workspace_id,
  date_trunc('month', occurred_at) as month,
  count(*) filter (where event_type='attendance_marked' and coalesce((metadata->>'present')::bool,true)) as attendance,
  count(*) filter (where event_type='person_created') as new_people,
  count(*) filter (where event_type='message_sent') as messages_sent,
  count(*) filter (where event_type='task_done') as tasks_done
from analytics_events
group by 1,2;

create index on mv_kpis_monthly (workspace_id, month);

-- Инсайты/подсказки
create table insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  severity text check (severity in ('info','warning','critical')) default 'info',
  title text not null,
  body text,
  created_at timestamptz default now(),
  valid_until timestamptz
);


  --Долгосрочное хранение (20+ лет): мы не ставим TTL. Для производительности:

  --индексы уже проставлены;

  --для analytics_events и attendances можно позже включить декларативное партиционирование по месяцу (легко мигрируется);

  --материализованные вьюхи дают быстрые графики на «за месяц/год/6 мес».

  --RLS (доступ по воркспейсу + ролям + модулям)

  --Включаем RLS на всех таблицах:

do $$
declare
  t text;
begin
  foreach t in array array[
    'workspaces','workspace_members','workspace_modules','workspace_settings',
    'people','groups','group_members','events','attendances',
    'task_boards','tasks','communications','sermons',
    'analytics_events','people_status_history','insights'
  ] loop
    execute format('alter table %I enable row level security;', t);
  end loop;
end$$;


--Хелперы:

create or replace function current_workspace_id()
returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'workspace_id','')::uuid
$$;

-- сравнение ролей через порядок: owner > admin > leader
create or replace function has_role_at_least(required role)
returns boolean language sql stable as $$
  select exists(
    select 1 from workspace_members
    where workspace_id = current_workspace_id()
      and user_id = auth.uid()
      and (
        (required = 'leader' and role in ('leader','admin','owner')) or
        (required = 'admin'  and role in ('admin','owner')) or
        (required = 'owner'  and role = 'owner')
      )
  );
$$;

create or replace function module_enabled(mod text)
returns boolean language sql stable as $$
  select coalesce( (select enabled from workspace_modules
                    where workspace_id = current_workspace_id() and module = mod), true );
$$;


--Политики (паттерн):

-- читать члены воркспейса (и модуль включен)
create policy ppl_read on people
  for select using (
    workspace_id = current_workspace_id()
    and exists(select 1 from workspace_members m where m.workspace_id = people.workspace_id and m.user_id = auth.uid())
    and module_enabled('people')
  );

-- писать лидеры+
CREATE POLICY ppl_write ON people
  FOR INSERT
  TO authenticated
  WITH CHECK (workspace_id = current_workspace_id() AND has_role_at_least('leader')); -- удалять только админы+

-- аналогично groups/events/tasks/communications/sermons


--Админка модулей/настроек/ролей — только admin+:

create policy modules_admin on workspace_modules
  for all using (has_role_at_least('admin')) with check (has_role_at_least('admin'));

create policy settings_admin on workspace_settings
  for all using (has_role_at_least('admin')) with check (has_role_at_least('admin'));

create policy members_admin on workspace_members
  for all using (has_role_at_least('admin')) with check (has_role_at_least('admin'));

/*
--Auth / учётки / роли из интерфейса
--Добавление пользователя (админка)

--В Studio → Auth → Add user (email+password).

--После создания — записать членство и роль

insert into workspace_members (workspace_id, user_id, role)
values (:ws, :user_id, 'leader'); -- или 'admin'/'owner'

--Саморегистрация + инвайт

Edge Function post-signup:

--Если есть invite_token → добавляем в workspace_members с ролью из инвайта.

--Если нет → создаём новый workspace, юзеру роль owner.

--В UI

--Выпадающий список «Рабочее пространство» (если их несколько).

--Экран «Модули и доступ» (видимость модулей + роли участников).

--Экран «Пользователи» (список, назначение роли, сброс пароля — через Admin API).

--Видимость модулей в интерфейсе

--При загрузке app:

const { data: modules } = await supabase.from('workspace_modules').select('*');
const enabled = new Set(modules.filter(m => m.enabled).map(m => m.module));
// Показываем меню/страницы только если enabled.has('analytics') и т.п.


--RLS дополнительно скроет данные бэком, даже если кто-то выстрелил в API напрямую.

--Аналитика → реальные графики и «умные подсказки»
--Логирование событий из UI
await supabase.from('analytics_events').insert({
  workspace_id, actor_user_id: user.id,
  event_type: 'attendance_marked',
  person_id, event_id, metadata: { present: true }
});

await supabase.from('analytics_events').insert({
  workspace_id, actor_user_id: user.id,
  event_type: 'task_done', metadata: { task_id }
});

await supabase.from('analytics_events').insert({
  workspace_id, actor_user_id: user.id,
  event_type: 'message_sent', value: 156, metadata: { communication_id }
});

--Обновление материализованных вьюх

--локально: pg_cron (если включен)
--или Supabase Scheduled Functions (рекомендуется)

--refresh materialized view concurrently mv_kpis_monthly;


--Edge Function refresh_kpis 👉 cron: «каждые 10 минут/час/день».

--Запросы для твоих графиков

--Динамика посещаемости (6 мес):

select month, attendance
from mv_kpis_monthly
where workspace_id = :ws and month >= date_trunc('month', now()) - interval '6 months'
order by month;


--Рост численности (новые участники по месяцам):

select month, new_people from mv_kpis_monthly
where workspace_id = :ws order by month;


--Кто пришёл / кто отвалился за период:

-- Пришли: все, у кого в истории статус менялся на active
select p.id, p.full_name, min(psh.changed_at) first_active_at
from people p
join people_status_history psh on psh.person_id = p.id
where p.workspace_id = :ws and psh.status = 'active'
  and psh.changed_at >= :from and psh.changed_at < :to
group by p.id, p.full_name
order by first_active_at;

-- Отвалились: у кого появился статус inactive
select p.id, p.full_name, max(psh.changed_at) last_inactive_at
from people p
join people_status_history psh on psh.person_id = p.id
where p.workspace_id = :ws and psh.status = 'inactive'
  and psh.changed_at >= :from and psh.changed_at < :to
group by p.id, p.full_name
order by last_inactive_at desc;


--Подсказки (пример правила): падение посещаемости молодежи >15% за 2 недели

insert into insights (workspace_id, severity, title, body, valid_until)
select :ws, 'warning',
       'Снижение посещаемости молодёжи',
       'За 2 недели посещаемость упала >15%. Свяжись с лидером группы.',
       now() + interval '14 days'
where (
  select coalesce(avg(attendance),0) from (
     select date_trunc('week', occurred_at) w, count(*) attendance
     from analytics_events
     where workspace_id = :ws
       and event_type='attendance_marked'
       and (metadata->>'group_tag')='youth'
     group by 1 order by 1 desc limit 2
  ) t
) < (
  select coalesce(avg(attendance),0) * 0.85 from (
     select date_trunc('week', occurred_at) w, count(*) attendance
     from analytics_events
     where workspace_id = :ws
       and event_type='attendance_marked'
       and (metadata->>'group_tag')='youth'
     group by 1 order by 1 desc offset 2 limit 4
  ) t2
);
*/