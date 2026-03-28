import { useState } from "react";
import { Plus, Fuel } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_FUEL_RECORDS, MOCK_VEHICLES } from "@/lib/mock";
import { todayYMD, formatDate } from "@/lib/utils/date";
import type { FuelRecord } from "@/lib/types";

export default function VehicleFuelPage() {
  const vehicle = MOCK_VEHICLES[0];
  const [records, setRecords] = useState<FuelRecord[]>(MOCK_FUEL_RECORDS);
  const [modalOpen, setModalOpen] = useState(false);

  const [formDate, setFormDate] = useState(todayYMD());
  const [formLiters, setFormLiters] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formStation, setFormStation] = useState("");

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const totalLiters = records.reduce((sum, r) => sum + r.liters, 0);
  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);

  const handleAdd = () => {
    if (!formDate || !formLiters || !formAmount) return;
    setRecords((prev) => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        vehicleId: vehicle.id,
        memberId: "m1",
        date: formDate,
        liters: parseFloat(formLiters),
        amount: parseInt(formAmount),
        stationName: formStation || undefined,
      },
    ]);
    setModalOpen(false);
    setFormDate(todayYMD());
    setFormLiters("");
    setFormAmount("");
    setFormStation("");
  };

  return (
    <>
      <TopHeader
        title="주유 기록"
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
        {/* 요약 카드 */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Fuel size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-text-base">{vehicle.name}</p>
              <p className="text-xs text-text-muted">주유 기록 요약</p>
            </div>
            <Button size="sm" onClick={() => setModalOpen(true)} className="ml-auto hidden lg:flex">
              <Plus size={16} />
              기록 추가
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xs text-text-muted mb-1">총 주유량</p>
              <p className="text-xl font-bold text-amber-600">{totalLiters.toFixed(1)}L</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-text-muted mb-1">총 금액</p>
              <p className="text-xl font-bold text-green-600">
                {totalAmount.toLocaleString()}원
              </p>
            </div>
          </div>
        </Card>

        {/* 목록 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">주유 기록</h2>
          <Card className="p-0 overflow-hidden">
            {sorted.length === 0 ? (
              <EmptyState icon="⛽" message="주유 기록이 없어요" />
            ) : (
              <div className="divide-y divide-gray-50">
                {sorted.map((record) => (
                  <div key={record.id} className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-base">
                          {formatDate(record.date)}
                        </p>
                        {record.stationName && (
                          <p className="text-xs text-text-muted mt-0.5">{record.stationName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-text-base">
                          {record.amount.toLocaleString()}원
                        </p>
                        <p className="text-xs text-text-muted">{record.liters}L</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="주유 기록 추가">
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
              <label className="block text-sm font-medium text-text-base mb-1.5">
                주유량 (L) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formLiters}
                onChange={(e) => setFormLiters(e.target.value)}
                placeholder="예: 45"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">
                금액 (원) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="예: 75600"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">주유소명 (선택)</label>
            <input
              type="text"
              value={formStation}
              onChange={(e) => setFormStation(e.target.value)}
              placeholder="예: GS칼텍스 강남점"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!formDate || !formLiters || !formAmount}
            className="w-full"
          >
            추가하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
