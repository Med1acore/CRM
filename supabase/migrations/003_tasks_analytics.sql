-- Tasks analytics for owners: per-user summaries and overdue metrics

-- Helpful indexes (safe to create if not exists semantics via unique names check manually by migration order)
create index if not exists idx_tasks_workspace_status on tasks (workspace_id, status);
create index if not exists idx_tasks_workspace_due on tasks (workspace_id, due_date);

-- View: per-user task summary inside current workspace, visible only to owners via WHERE
create or replace view v_task_summary_by_user as
select
  t.workspace_id,
  t.assignee_person_id,
  count(*) as tasks_total,
  count(*) filter (where t.status = 'todo') as tasks_todo,
  count(*) filter (where t.status = 'in_progress') as tasks_in_progress,
  count(*) filter (where t.status = 'done') as tasks_done,
  count(*) filter (where t.status <> 'done' and t.due_date is not null and t.due_date < current_date) as tasks_overdue,
  max(ae.occurred_at) filter (where ae.event_type = 'task_done' and (ae.metadata->>'task_id')::uuid = t.id) as last_completed_at
from tasks t
left join analytics_events ae
  on ae.workspace_id = t.workspace_id and (ae.metadata->>'task_id')::uuid = t.id and ae.event_type = 'task_done'
where t.workspace_id = current_workspace_id()
  and has_role_at_least('owner')
group by 1,2;

-- View: overdue tasks list with basic fields for owners
create or replace view v_tasks_overdue as
select
  t.id,
  t.workspace_id,
  t.assignee_person_id,
  t.title,
  t.due_date,
  t.status,
  t.created_at,
  t.created_by
from tasks t
where t.workspace_id = current_workspace_id()
  and has_role_at_least('owner')
  and t.status <> 'done'
  and t.due_date is not null
  and t.due_date < current_date;

-- Optional: summary per board for owners
create or replace view v_task_summary_by_board as
select
  t.workspace_id,
  t.board_id,
  count(*) as tasks_total,
  count(*) filter (where t.status = 'todo') as tasks_todo,
  count(*) filter (where t.status = 'in_progress') as tasks_in_progress,
  count(*) filter (where t.status = 'done') as tasks_done,
  count(*) filter (where t.status <> 'done' and t.due_date is not null and t.due_date < current_date) as tasks_overdue
from tasks t
where t.workspace_id = current_workspace_id()
  and has_role_at_least('owner')
group by 1,2;

-- Notes:
-- 1) Views include has_role_at_least('owner') in WHERE, so non-owners will see empty results.
-- 2) RLS still applies on underlying tables; views are filtered by current_workspace_id().
-- 3) Use these views directly from the app for owner analytics dashboards.


