import type { Person } from '@/types/person';
import { Mail, Phone, User } from 'lucide-react';

export function PersonCard({
  person,
  onEdit,
  onDelete,
}: {
  person: Person;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex gap-4">
      <div className="flex-shrink-0">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="flex-grow flex flex-col gap-3">
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{person.fullName}</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" /> {person.email}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Phone className="h-4 w-4" /> {person.phone}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="inline-flex px-2 py-1 rounded-md text-xs bg-primary/20 text-primary-foreground/90">
            {person.status}
          </div>
          <div className="flex flex-wrap gap-2">
            {person.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="btn btn-secondary"
            onClick={() => (onEdit ? onEdit(person.id) : console.log('Edit person:', person.id))}
          >
            Редактировать
          </button>
          <button
            className="btn btn-danger"
            onClick={() =>
              onDelete ? onDelete(person.id) : console.log('Delete person:', person.id)
            }
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
