import Link from "next/link";
import {
  UtensilsCrossed,
  Trash2,
  SprayCanIcon as Spray,
  Users,
  Refrigerator,
} from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";

interface LifeMenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const LIFE_MENU_ITEMS: LifeMenuItem[] = [
  {
    href: "/menu",
    icon: <UtensilsCrossed size={28} />,
    label: "오늘의 메뉴",
    description: "아침·점심·저녁 메뉴를 등록하고 확인해요",
    color: "#FF8C69",
  },
  {
    href: "/trash",
    icon: <Trash2 size={28} />,
    label: "쓰레기 담당",
    description: "쓰레기 배출 일정과 담당자를 관리해요",
    color: "#90D5A8",
  },
  {
    href: "/cleaning",
    icon: <Spray size={28} />,
    label: "청소 담당",
    description: "청소 항목별 담당자와 완료 여부를 확인해요",
    color: "#C4B5FD",
  },
  {
    href: "/attendance",
    icon: <Users size={28} />,
    label: "귀가/외박",
    description: "가족 구성원의 귀가·외박 현황을 공유해요",
    color: "#A8D8EA",
  },
  {
    href: "/fridge",
    icon: <Refrigerator size={28} />,
    label: "냉장고 재고",
    description: "냉장고 식재료와 유통기한을 한눈에 봐요",
    color: "#FFD580",
  },
];

export default function LifePage() {
  return (
    <>
      <TopHeader title="생활관리" />
      <div className="px-4 py-5 max-w-2xl mx-auto">
        <div className="mb-5 hidden md:block">
          <h1 className="text-2xl font-bold text-text-base">생활관리</h1>
          <p className="text-sm text-text-muted mt-1">가족의 일상을 함께 관리해요</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {LIFE_MENU_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Card className="flex items-center gap-4 p-4 active:scale-[0.98] transition-transform">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-base">{item.label}</p>
                  <p className="text-sm text-text-muted mt-0.5">{item.description}</p>
                </div>
                <div className="text-text-muted">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
