-- Add text column for Kanban state compatible with UI
alter table tasks add column if not exists column text;

-- Apply constraint for allowed values
do $$ begin
  if not exists (
    select 1 from information_schema.constraint_column_usage
    where table_name='tasks' and constraint_name='tasks_column_check'
  ) then
    alter table tasks add constraint tasks_column_check check (column in ('todo','inprogress','done'));
  end if;
end $$;

-- Backfill from existing status enum if present
update tasks set column = case
  when column is not null then column
  when status::text = 'in_progress' then 'inprogress'
  when status::text = 'done' then 'done'
  else 'todo'
end;

-- Default for new rows
alter table tasks alter column column set default 'todo';

create index if not exists idx_tasks_column on tasks (column);


