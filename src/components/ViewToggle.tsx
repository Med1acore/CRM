import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-md">
      <button
        className={`btn ${viewMode === 'grid' ? 'btn-secondary' : 'btn'}`}
        onClick={() => setViewMode('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        className={`btn ${viewMode === 'list' ? 'btn-secondary' : 'btn'}`}
        onClick={() => setViewMode('list')}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}


