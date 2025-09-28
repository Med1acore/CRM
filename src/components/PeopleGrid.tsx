import type { Person } from "@/types/person";
import { PersonCard } from "./PersonCard";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from "react";

export function PeopleGrid({ people, onEdit, onDelete }: { people: Person[]; onEdit?: (id: string) => void; onDelete?: (id: string) => void }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: Math.ceil(people.length / 3),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[70vh] overflow-y-auto">
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => {
          const startIndex = virtualRow.index * 3;
          const endIndex = Math.min(startIndex + 3, people.length);
          const rowPeople = people.slice(startIndex, endIndex);

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                padding: '0 8px'
              }}
            >
              {rowPeople.map(person => (
                <PersonCard key={person.id} person={person} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}


