"use client";

import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MOCK_ATTENDANCE } from "@/lib/mock";
import { MOCK_MEMBERS } from "@/lib/mock/members";
import { todayYMD } from "@/lib/utils/date";
import type { AttendanceStatus, AttendanceStatusType } from "@/lib/types";
import type { FamilyMember } from "@/lib/types";

const STATUS_CONFIG: Record<
  AttendanceStatusType,
  { label: string; badgeVariant: "success" | "primary" | "default"; bgColor: string }
> = {
  HOME: { label: "귀가 예정", badgeVariant: "success", bgColor: "bg-green-50" },
  OUT: { label: "외박", badgeVariant: "primary", bgColor: "bg-blue-50" },
  UNKNOWN: { label: "미정", badgeVariant: "default", bgColor: "bg-gray-50" },
};

export default function AttendancePage() {
  const today = todayYMD();
  const [attendances, setAttendances] = useState<AttendanceStatus[]>(MOCK_ATTENDANCE);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatusType>("UNKNOWN");
  const [editReturnTime, setEditReturnTime] = useState("");
  const [editMemo, setEditMemo] = useState("");

  const getAttendance = (memberId: string) =>
    attendances.find((a) => a.date === today && a.memberId === memberId);

  const openModal = (member: FamilyMember) => {
    const att = getAttendance(member.id);
    setSelectedMember(member);
    setEditStatus(att?.status ?? "UNKNOWN");
    setEditReturnTime(att?.expectedReturnTime ?? "");
    setEditMemo(att?.memo ?? "");
  };

  const handleSave = () => {
    if (!selectedMember) return;
    setAttendances((prev) => {
      const filtered = prev.filter(
        (a) => !(a.date === today && a.memberId === selectedMember.id)
      );
      return [
        ...filtered,
        {
          id: `a-${Date.now()}`,
          date: today,
          memberId: selectedMember.id,
          status: editStatus,
          expectedReturnTime: editReturnTime || undefined,
          memo: editMemo || undefined,
        },
      ];
    });
    setSelectedMember(null);
  };

  return (
    <>
      <TopHeader title="귀가/외박 현황" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto">
        <div className="mb-5 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">귀가/외박 현황</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_MEMBERS.map((member) => {
            const att = getAttendance(member.id);
            const status = att?.status ?? "UNKNOWN";
            const config = STATUS_CONFIG[status];
            return (
              <button
                key={member.id}
                onClick={() => openModal(member)}
                className="text-left"
              >
                <Card className={`flex flex-col items-center gap-3 py-5 ${config.bgColor} active:scale-[0.97] transition-transform`}>
                  <Avatar member={member} size="lg" />
                  <div className="text-center">
                    <p className="font-semibold text-text-base">{member.name}</p>
                    <Badge variant={config.badgeVariant} className="mt-1">
                      {config.label}
                    </Badge>
                    {att?.expectedReturnTime && (
                      <p className="text-xs text-text-muted mt-1">
                        귀가 예정 {att.expectedReturnTime}
                      </p>
                    )}
                    {att?.memo && (
                      <p className="text-xs text-text-muted mt-0.5 truncate max-w-full">
                        {att.memo}
                      </p>
                    )}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={`${selectedMember?.name ?? ""} 상태 변경`}
      >
        <div className="flex flex-col gap-4">
          {/* 상태 선택 */}
          <div>
            <p className="text-sm font-medium text-text-base mb-2">상태</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STATUS_CONFIG) as AttendanceStatusType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setEditStatus(s)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors min-h-[44px] ${
                    editStatus === s
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-text-base"
                  }`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* 귀가 예상 시간 */}
          {editStatus === "HOME" && (
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">
                귀가 예상 시간
              </label>
              <input
                type="time"
                value={editReturnTime}
                onChange={(e) => setEditReturnTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          {/* 메모 */}
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              메모 (선택)
            </label>
            <input
              type="text"
              value={editMemo}
              onChange={(e) => setEditMemo(e.target.value)}
              placeholder="예: 친구 집에서 잠"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            저장하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
