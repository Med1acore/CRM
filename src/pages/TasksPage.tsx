import { KanbanBoard } from '@/components/KanbanBoard';

export function TasksPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Задачи</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Управляйте задачами</p>
      </div>
      <div className="card p-4 sm:p-6">
        <KanbanBoard />
      </div>
    </div>
  );
}

export default TasksPage;


