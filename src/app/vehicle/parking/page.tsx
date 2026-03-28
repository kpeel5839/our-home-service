"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_PARKING_RECORDS, MOCK_VEHICLES } from "@/lib/mock";
import { getMemberById } from "@/lib/mock/members";
import { formatDate, formatTime } from "@/lib/utils/date";
import type { ParkingRecord } from "@/lib/types";

export default function VehicleParkingPage() {
  const vehicle = MOCK_VEHICLES[0];
  const [records, setRecords] = useState<ParkingRecord[]>(MOCK_PARKING_RECORDS);
  const [modalOpen, setModalOpen] = useState(false);

  const [formFloor, setFormFloor] = useState("");
  const [formZone, setFormZone] = useState("");
  const [formMemo, setFormMemo] = useState("");

  const sorted = [...records].sort((a, b) =>
    b.recordedAt.localeCompare(a.recordedAt)
  );
  const current = sorted[0];
  const history = sorted.slice(1);

  const handleAdd = () => {
    if (!formFloor.trim()) return;
    setRecords((prev) => [
      {
        id: `p-${Date.now()}`,
        vehicleId: vehicle.id,
        memberId: "m1",
        floor: formFloor.trim(),
        zone: formZone.trim() || undefined,
        memo: formMemo.trim() || undefined,
        recordedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setModalOpen(false);
    setFormFloor("");
    setFormZone("");
    setFormMemo("");
  };

  return (
    <>
      <TopHeader
        title="주차 위치"
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
        {/* 현재 주차 위치 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">현재 주차 위치</h2>
          {current ? (
            <Card className="bg-primary-light border-primary border p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-primary">{current.floor}</p>
                  {current.zone && (
                    <p className="text-lg font-semibold text-primary/80">{current.zone} 구역</p>
                  )}
                  {current.memo && (
                    <p className="text-sm text-text-muted mt-1">{current.memo}</p>
                  )}
                  <p className="text-xs text-text-muted mt-2">
                    {formatDate(current.recordedAt.slice(0, 10))} {formatTime(current.recordedAt)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                variant="primary"
                className="w-full mt-4"
              >
                <Plus size={16} />
                위치 업데이트
              </Button>
            </Card>
          ) : (
            <Card>
              <EmptyState
                icon="🚗"
                message="주차 위치가 등록되지 않았어요"
                sub="위치 기록 버튼으로 등록해보세요"
              />
              <Button onClick={() => setModalOpen(true)} className="w-full mt-4">
                위치 기록하기
              </Button>
            </Card>
          )}
        </section>

        {/* 최근 기록 */}
        {history.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-text-muted mb-2">최근 기록</h2>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {history.map((record) => {
                  const member = getMemberById(record.memberId);
                  return (
                    <div key={record.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-base">
                          {record.floor}{record.zone ? ` · ${record.zone}` : ""}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(record.recordedAt.slice(0, 10))} {formatTime(record.recordedAt)}
                        </p>
                      </div>
                      {member && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Avatar member={member} size="sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="주차 위치 기록">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              층수 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formFloor}
              onChange={(e) => setFormFloor(e.target.value)}
              placeholder="예: B2, 3층"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">구역 (선택)</label>
            <input
              type="text"
              value={formZone}
              onChange={(e) => setFormZone(e.target.value)}
              placeholder="예: A-12, 북쪽"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">메모 (선택)</label>
            <input
              type="text"
              value={formMemo}
              onChange={(e) => setFormMemo(e.target.value)}
              placeholder="예: 엘리베이터 근처"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button onClick={handleAdd} disabled={!formFloor.trim()} className="w-full">
            기록하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
