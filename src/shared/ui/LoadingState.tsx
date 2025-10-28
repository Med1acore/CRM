interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Загрузка...' }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export const LoadingSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-16 bg-muted rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

