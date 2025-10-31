import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function TaskCard({ id, title, isActive }: { id: string; title: string; isActive?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = isActive
    ? {}
    : ({ transform: CSS.Transform.toString(transform), transition } as React.CSSProperties);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-slate-700 rounded-md p-3 mb-2 cursor-grab active:cursor-grabbing select-none text-white ${
        isActive ? 'opacity-0 pointer-events-none h-0 p-0 mb-0' : ''
      }`}
    >
      {title}
    </div>
  );
}


