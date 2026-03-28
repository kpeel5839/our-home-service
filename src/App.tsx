import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";

import LoginPage from "@/app/login/page";
import OAuthCallbackPage from "@/app/oauth/callback/page";
import HomePage from "@/app/page";
import LifePage from "@/app/life/page";
import MenuPage from "@/app/menu/page";
import TrashPage from "@/app/trash/page";
import CleaningPage from "@/app/cleaning/page";
import AttendancePage from "@/app/attendance/page";
import FridgePage from "@/app/fridge/page";
import VehicleLayout from "@/app/vehicle/layout";
import VehicleReservePage from "@/app/vehicle/reserve/page";
import VehicleFuelPage from "@/app/vehicle/fuel/page";
import VehicleParkingPage from "@/app/vehicle/parking/page";
import CommunityPage from "@/app/community/page";
import CommunityNewPage from "@/app/community/new/page";
import CommunityDetailPage from "@/app/community/[id]/page";
import SettingsPage from "@/app/settings/page";

/** 로그인 여부에 따라 보호하는 래퍼 */
function PrivateRoutes() {
  const { member, loading } = useAuth();

  // 토큰 복원 중 — 전체 화면 스피너
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 미로그인 → 로그인 페이지
  if (!member) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/life" element={<LifePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/cleaning" element={<CleaningPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/fridge" element={<FridgePage />} />
        <Route path="/vehicle" element={<VehicleLayout />}>
          <Route path="reserve" element={<VehicleReservePage />} />
          <Route path="fuel" element={<VehicleFuelPage />} />
          <Route path="parking" element={<VehicleParkingPage />} />
        </Route>
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new" element={<CommunityNewPage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/*" element={<PrivateRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

/** 이미 로그인된 상태에서 /login 접근 시 홈으로 */
function PublicRoute() {
  const { member, loading } = useAuth();
  if (loading) return null;
  if (member) return <Navigate to="/" replace />;
  return <LoginPage />;
}
