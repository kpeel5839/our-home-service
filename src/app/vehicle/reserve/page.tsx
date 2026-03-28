"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_VEHICLES, MOCK_RESERVATIONS } from "@/lib/mock";
import { MOCK_MEMBERS, getMemberById } from "@/lib/mock/members";
import { todayYMD, formatDate, formatTime } from "@/lib/utils/date";
import type { VehicleReservation } from "@/lib/types";

export default function VehicleReservePage() {
  const today = todayYMD();
  const vehicle = MOCK_VEHICLES[0];
  const [reservations, setReservations] = useState<VehicleReservation[]>(MOCK_RESERVATIONS);
  const [modalOpen, setModalOpen] = useState(false);

  const [formDate, setFormDate] = useState(today);
  const [formStart, setFormStart] = useState("09:00");
  const [formEnd, setFormEnd] = useState("11:00");
  const [formPurpose, setFormPurpose] = useState("");
  const [formMemberId, setFormMemberId] = useState(MOCK_MEMBERS[0].id);

  const sorted = [...reservations].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
  const todayReservations = sorted.filter((r) => r.startTime.startsWith(today));
  const upcomingReservations = sorted.filter((r) => r.startTime > `${today}T99`);

  const handleAdd = () => {
    if (!formDate || !formStart || !formEnd) return;
    setReservations((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        vehicleId: vehicle.id,
        memberId: formMemberId,
        startTime: `${formDate}T${formStart}:00`,
        endTime: `${formDate}T${formEnd}:00`,
        purpose: formPurpose || undefined,
      },
    ]);
    setModalOpen(false);
    setFormDate(today);
    setFormStart("09:00");
    setFormEnd("11:00");
    setFormPurpose("");
    setFormMemberId(MOCK_MEMBERS[0].id);
  };

  const ReservationRow = ({ r }: { r: VehicleReservation }) => {
    const member = getMemberById(r.memberId);
    const isToday = r.startTime.startsWith(today);
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isToday && <Badge variant="primary">오늘</Badge>}
            <span className="text-sm font-medium text-text-base">
              {formatDate(r.startTime.slice(0, 10))}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            {formatTime(r.startTime)} ~ {formatTime(r.endTime)}
            {r.purpose ? ` · ${r.purpose}` : ""}
          </p>
        </div>
        {member && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Avatar member={member} size="sm" />
            <span className="text-sm text-text-base">{member.name}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <TopHeader
        title="차량 예약"
        showBack
        right={
          <button
            onClick={() => setModalOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-primary"
          >
            <Plus size={22} />
          </button>
        }
      />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto space-y-4">
        {/* 차량 정보 */}
        <Card className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-2xl">
            🚗
          </div>
          <div>
            <p className="font-semibold text-text-base">{vehicle.name}</p>
            <p className="text-sm text-text-muted">{vehicle.plateNumber}</p>
          </div>
          <div className="ml-auto">
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={16} />
              예약하기
            </Button>
          </div>
        </Card>

        {/* 오늘 예약 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">오늘 예약</h2>
          <Card className="p-0 overflow-hidden">
            {todayReservations.length === 0 ? (
              <EmptyState message="오늘 예약이 없어요" />
            ) : (
              <div className="px-4">
                {todayReservations.map((r) => (
                  <ReservationRow key={r.id} r={r} />
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* 향후 예약 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">향후 예약</h2>
          <Card className="p-0 overflow-hidden">
            {upcomingReservations.length === 0 ? (
              <EmptyState message="예정된 예약이 없어요" />
            ) : (
              <div className="px-4">
                {upcomingReservations.map((r) => (
                  <ReservationRow key={r.id} r={r} />
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="차량 예약하기">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              날짜 <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">시작 시간</label>
              <input
                type="time"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">종료 시간</label>
              <input
                type="time"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">예약자</label>
            <select
              value={formMemberId}
              onChange={(e) => setFormMemberId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              {MOCK_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">목적 (선택)</label>
            <input
              type="text"
              value={formPurpose}
              onChange={(e) => setFormPurpose(e.target.value)}
              placeholder="예: 마트 장보기"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button onClick={handleAdd} disabled={!formDate} className="w-full">
            예약하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
