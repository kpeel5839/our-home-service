"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Car, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Tab {
  label: string;
  icon: React.ReactNode;
  href: string;
  exact?: boolean;
}

const TABS: Tab[] = [
  { label: "홈", icon: <Home size={22} />, href: "/", exact: true },
  { label: "생활관리", icon: <LayoutGrid size={22} />, href: "/life" },
  { label: "차량", icon: <Car size={22} />, href: "/vehicle" },
  { label: "커뮤니티", icon: <MessageCircle size={22} />, href: "/community" },
  { label: "설정", icon: <Settings size={22} />, href: "/settings" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (tab: Tab) => {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 md:hidden">
      <div className="flex pb-safe">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors",
              isActive(tab) ? "text-primary" : "text-text-muted"
            )}
          >
            <span className={cn("transition-transform", isActive(tab) && "scale-110")}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
