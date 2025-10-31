import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        setErrorText('Supabase не инициализирован: проверьте VITE_SUPABASE_URL/ANON_KEY');
        return;
      }
      const workspace_id = "f233aec4-3b13-4a2b-ae9c-50d9e7b00801";
      const { data, error } = await supabase
        .from('tasks')
        .select('id,title,column,created_at')
        .eq('workspace_id', workspace_id)
        .order('created_at', { ascending: true });
      if (!mounted) return;
      if (error) {
        console.error('Supabase error loading tasks:', error);
        setErrorText(`Ошибка: ${error.message}. Проверьте .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`);
      }
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

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeId) || null, [tasks, activeId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);
    if (taskId === overId) return;

    const activeTask = tasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    let targetColumn: ColumnId | null = null;
    if (overId === 'todo' || overId === 'inprogress' || overId === 'done') {
      targetColumn = overId as ColumnId;
    } else {
      const inTodo = lists.todo.find((t) => t.id === overId);
      const inProg = lists.inprogress.find((t) => t.id === overId);
      const inDone = lists.done.find((t) => t.id === overId);
      if (inTodo) targetColumn = 'todo';
      else if (inProg) targetColumn = 'inprogress';
      else if (inDone) targetColumn = 'done';
    }
    if (!targetColumn) return;

    const sourceColumn = activeTask.column;

    if (sourceColumn === targetColumn) {
      const columnTasks = lists[sourceColumn];
      const oldIndex = columnTasks.findIndex((t) => t.id === taskId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks((prev) => [
        ...prev.filter((t) => t.column !== sourceColumn),
        ...reordered,
      ]);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, column: targetColumn as ColumnId } : t)));
      if (supabase) {
        const { error } = await supabase.from('tasks').update({ column: targetColumn }).eq('id', taskId);
        if (error) setErrorText(error.message);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <div className="bg-slate-700 rounded-md p-3 text-white shadow-2xl">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}


