"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, UtensilsCrossed, Trash2, SprayCanIcon as Spray, Users,
  Car, MessageCircle, Refrigerator, Settings, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const LIFE_ITEMS: NavItem[] = [
  { label: "오늘의 메뉴", href: "/menu", icon: <UtensilsCrossed size={18} /> },
  { label: "쓰레기 담당", href: "/trash", icon: <Trash2 size={18} /> },
  { label: "청소 담당", href: "/cleaning", icon: <Spray size={18} /> },
  { label: "귀가/외박", href: "/attendance", icon: <Users size={18} /> },
  { label: "냉장고 재고", href: "/fridge", icon: <Refrigerator size={18} /> },
];

const VEHICLE_ITEMS: NavItem[] = [
  { label: "차량 예약", href: "/vehicle/reserve", icon: <Car size={18} /> },
  { label: "주유 기록", href: "/vehicle/fuel", icon: <ChevronRight size={18} /> },
  { label: "주차 위치", href: "/vehicle/parking", icon: <ChevronRight size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary">우리 집 🏠</h1>
        <p className="text-xs text-text-muted mt-0.5">가족 생활 관리</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* 홈 */}
        <NavLink href="/" icon={<Home size={18} />} label="홈 대시보드" active={isActive("/", true)} />

        {/* 생활관리 */}
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mt-5 mb-2">
          생활관리
        </p>
        {LIFE_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}

        {/* 차량관리 */}
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mt-5 mb-2">
          차량관리
        </p>
        {VEHICLE_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}

        {/* 커뮤니티 */}
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mt-5 mb-2">
          커뮤니티
        </p>
        <NavLink
          href="/community"
          icon={<MessageCircle size={18} />}
          label="가족 피드"
          active={isActive("/community")}
        />
      </nav>

      {/* 설정 */}
      <div className="border-t border-gray-100 px-3 py-3">
        <NavLink
          href="/settings"
          icon={<Settings size={18} />}
          label="설정"
          active={isActive("/settings")}
        />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5",
        active
          ? "bg-primary-light text-primary"
          : "text-text-base hover:bg-gray-50"
      )}
    >
      <span className={cn(active ? "text-primary" : "text-text-muted")}>{icon}</span>
      {label}
    </Link>
  );
}
