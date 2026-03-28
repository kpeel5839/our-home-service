import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils/cn";

const VEHICLE_TABS = [
  { label: "예약", href: "/vehicle/reserve" },
  { label: "주유", href: "/vehicle/fuel" },
  { label: "주차", href: "/vehicle/parking" },
];

export default function VehicleLayout() {
  const { pathname } = useLocation();

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="sticky top-14 lg:top-0 z-20 bg-white border-b border-gray-100">
        <div className="flex max-w-2xl tablet:max-w-3xl mx-auto px-4">
          {VEHICLE_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex-1 py-3 text-sm font-medium text-center transition-colors min-h-[44px] flex items-center justify-center",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
