import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Car, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { label: "홈", icon: <Home size={22} />, href: "/", exact: true },
  { label: "생활", icon: <LayoutGrid size={22} />, href: "/life" },
  { label: "차량", icon: <Car size={22} />, href: "/vehicle" },
  { label: "주식", icon: <TrendingUp size={22} />, href: "/stocks" },
  { label: "설정", icon: <Settings size={22} />, href: "/settings" },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  const isActive = (tab: (typeof TABS)[number]) => {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  };

  return (
    // lg(1024px) 이상에서는 사이드바가 있으므로 탭바 숨김
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 lg:hidden">
      <div className="flex pb-safe">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors",
              isActive(tab) ? "text-primary" : "text-text-muted"
            )}
          >
            <span className={cn("transition-transform", isActive(tab) && "scale-110")}>
              {tab.icon}
            </span>
            <span className="text-[9px] xs:text-[10px] font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
