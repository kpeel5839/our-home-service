"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export function TopHeader({ title, showBack, right, className }: TopHeaderProps) {
  const router = useRouter();

  return (
    // lg(1024px) 이상에서는 사이드바가 있으므로 TopHeader 숨김
    <header
      className={cn(
        "sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100",
        "flex items-center h-14 px-4 gap-2 lg:hidden",
        className
      )}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-text-base"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="flex-1 font-semibold text-base truncate">{title}</h1>
      {right && <div className="flex items-center">{right}</div>}
    </header>
  );
}
