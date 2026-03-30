import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto px-6">
      <div className="w-16 h-16 bg-surface-container-lowest border border-border/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Icon className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="lg"
          className="font-mono uppercase tracking-widest text-xs"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
