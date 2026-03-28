import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  href?: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  icon,
  href,
  accentColor = "#FF8C69",
  children,
  className,
}: DashboardCardProps) {
  const content = (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm p-4 border-l-4",
        className
      )}
      style={{ borderLeftColor: accentColor }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: accentColor }}>{icon}</span>
          <h2 className="font-semibold text-sm text-text-base">{title}</h2>
        </div>
        {href && <ChevronRight size={16} className="text-text-muted" />}
      </div>
      {children}
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }
  return content;
}
