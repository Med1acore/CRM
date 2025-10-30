-- Add task position for ordering within a status column
alter table tasks add column if not exists position int default 0;
create index if not exists idx_tasks_workspace_status_position on tasks (workspace_id, status, position);

-- Basic RLS policies for tasks and task_boards (workspace-scoped)
-- Allow members of workspace to read when module enabled
create policy if not exists tasks_read on tasks
  for select using (
    workspace_id = current_workspace_id()
    and exists(select 1 from workspace_members m where m.workspace_id = tasks.workspace_id and m.user_id = auth.uid())
    and module_enabled('tasks')
  );

create policy if not exists tasks_write on tasks
  for insert to authenticated with check (
    workspace_id = current_workspace_id() and has_role_at_least('leader') and module_enabled('tasks')
  );

create policy if not exists tasks_update on tasks
  for update to authenticated using (
    workspace_id = current_workspace_id() and has_role_at_least('leader') and module_enabled('tasks')
  ) with check (
    workspace_id = current_workspace_id()
  );

create policy if not exists boards_read on task_boards
  for select using (
    workspace_id = current_workspace_id()
    and exists(select 1 from workspace_members m where m.workspace_id = task_boards.workspace_id and m.user_id = auth.uid())
    and module_enabled('tasks')
  );

create policy if not exists boards_write on task_boards
  for insert to authenticated with check (
    workspace_id = current_workspace_id() and has_role_at_least('leader') and module_enabled('tasks')
  );


