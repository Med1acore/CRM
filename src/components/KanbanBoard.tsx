import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { supabase } from '@/lib/supabase';
import { Column } from './Column';
import { TaskCard } from './TaskCard';

type Task = { id: string; title: string; column: 'todo' | 'inprogress' | 'done'; created_at?: string };
type ColumnId = Task['column'];

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'Нужно сделать' },
  { id: 'inprogress', title: 'В работе' },
  { id: 'done', title: 'Готово' },
];

export function KanbanBoard() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        setErrorText('Supabase не инициализирован: проверьте VITE_SUPABASE_URL/ANON_KEY');
        return;
      }
      const { data, error } = await supabase
        .from('tasks')
        .select('id,title,column,created_at')
        .order('created_at', { ascending: true });
      if (!mounted) return;
      if (error) setErrorText(error.message);
      if (!error && data) setTasks(data as Task[]);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const lists = useMemo(() => {
    const map: Record<ColumnId, Task[]> = { todo: [], inprogress: [], done: [] };
    for (const t of tasks) map[t.column].push(t);
    return map;
  }, [tasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = String(active.id);
    const overId = String(over.id);

    // overId может быть ID колонки или другой задачи => найдём целевую колонку
    let target: ColumnId | null = null;
    if (overId === 'todo' || overId === 'inprogress' || overId === 'done') target = overId as ColumnId;
    else {
      const inTodo = lists.todo.find((t) => t.id === overId);
      const inProg = lists.inprogress.find((t) => t.id === overId);
      const inDone = lists.done.find((t) => t.id === overId);
      if (inTodo) target = 'todo';
      else if (inProg) target = 'inprogress';
      else if (inDone) target = 'done';
    }
    if (!target) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, column: target! } : t)));
    if (supabase) {
      const { error } = await supabase.from('tasks').update({ column: target }).eq('id', taskId);
      if (error) setErrorText(error.message);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {errorText && (
        <div className="mb-3 text-sm text-red-300 bg-red-900/30 border border-red-700 rounded p-3">
          {errorText}
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto p-2">
        {COLUMNS.map((c) => (
          <Column
            key={c.id}
            id={c.id}
            title={c.title}
            onAddTask={async (title) => {
              const optimistic: Task = { id: crypto.randomUUID(), title, column: c.id } as Task;
              setTasks((prev) => [...prev, optimistic]);
              if (!supabase) return;
              const workspace_id = "f233aec4-3b13-4a2b-ae9c-50d9e7b00801";
              const { data, error } = await supabase
                .from('tasks')
                .insert({ title, column: c.id, workspace_id })
                .select('id,title,column,created_at')
                .single();
              if (error) {
                setErrorText(error.message);
                // откат
                setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
              } else if (data) {
                setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? (data as Task) : t)));
              }
            }}
          >
            <SortableContext items={lists[c.id].map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {lists[c.id].map((t) => (
                <TaskCard key={t.id} id={t.id} title={t.title} />
              ))}
            </SortableContext>
          </Column>
        ))}
      </div>
    </DndContext>
  );
}


