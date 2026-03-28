import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-white rounded-2xl shadow-sm p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
