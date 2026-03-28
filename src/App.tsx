import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

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
import CommunityDetailPage from "@/app/community/[id]/page";
import SettingsPage from "@/app/settings/page";

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
