-- =====================================================
-- 002_policies.sql — базовые функции и политики доступа
-- =====================================================

-- 1️⃣ Функция для проверки роли пользователя в воркспейсе
create or replace function public.has_role_at_least(
  user_id uuid,
  workspace_id uuid,
  required_role text
)
returns boolean as $$
declare
  user_role text;
begin
  select wm.role into user_role
  from workspace_members wm
  where wm.user_id = has_role_at_least.user_id
    and wm.workspace_id = has_role_at_least.workspace_id;

  if user_role is null then
    return false;
  end if;

  -- порядок: owner > admin > leader > member
  return (
    (required_role = 'leader' and user_role in ('leader','admin','owner')) or
    (required_role = 'admin' and user_role in ('admin','owner')) or
    (required_role = 'owner' and user_role = 'owner') or
    (required_role = 'member' and user_role in ('member','leader','admin','owner'))
  );
end;
$$ language plpgsql security definer;

-- 2️⃣ Включаем RLS на все таблицы
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table workspace_modules enable row level security;
alter table workspace_settings enable row level security;
alter table people enable row level security;
alter table groups enable row level security;
alter table events enable row level security;

-- 3️⃣ Пример политик для workspaces
create policy "workspace_owner_full_access"
on workspaces
for all
using (has_role_at_least(auth.uid(), id, 'owner'));

-- 4️⃣ Пример политик для участников
create policy "workspace_members_access"
on workspace_members
for select
using (has_role_at_least(auth.uid(), workspace_id, 'leader'));

-- 5️⃣ Пример политик для people (люди)
create policy "people_visible_to_workspace"
on people
for select
using (has_role_at_least(auth.uid(), workspace_id, 'member'));

create policy "people_edit_by_leader"
on people
for update
using (has_role_at_least(auth.uid(), workspace_id, 'leader'));

create policy "people_insert_by_admin"
on people
for insert
with check (has_role_at_least(auth.uid(), workspace_id, 'admin'));

-- 6️⃣ Политика для групп
create policy "groups_visible"
on groups
for select
using (has_role_at_least(auth.uid(), workspace_id, 'member'));
