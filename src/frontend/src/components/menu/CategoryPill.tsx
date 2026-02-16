import { cn } from '@/lib/utils';

interface CategoryPillProps {
  name: string;
  thumbnail: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryPill({ name, thumbnail, isSelected, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 px-4 py-3 rounded-full border-2 transition-all duration-200 shrink-0 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected
          ? 'bg-primary border-primary text-primary-foreground shadow-soft'
          : 'bg-background border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      aria-pressed={isSelected}
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className={cn(
        'text-xs font-medium text-center leading-tight',
        isSelected ? 'text-primary-foreground' : 'text-foreground'
      )}>
        {name}
      </span>
    </button>
  );
}
