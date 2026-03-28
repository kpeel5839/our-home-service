import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  sub?: string;
  className?: string;
}

export function EmptyState({ icon, message, sub, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-10 text-center gap-2", className)}>
      {icon && <div className="text-4xl mb-1">{icon}</div>}
      <p className="text-text-base font-medium">{message}</p>
      {sub && <p className="text-sm text-text-muted">{sub}</p>}
    </div>
  );
}
