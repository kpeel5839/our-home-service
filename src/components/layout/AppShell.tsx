import { Sidebar } from "./Sidebar";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
