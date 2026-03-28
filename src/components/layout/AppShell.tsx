import { Sidebar } from "./Sidebar";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* 사이드바: 노트북(lg=1024px) 이상에서만 표시 */}
      <Sidebar />
      {/* 콘텐츠: 노트북에서는 사이드바 너비만큼 왼쪽 여백, 모바일/Fold 펼침에서는 하단 탭 높이만큼 패딩 */}
      <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
      {/* 하단 탭바: 노트북(lg) 미만에서만 표시 */}
      <BottomTabBar />
    </div>
  );
}
