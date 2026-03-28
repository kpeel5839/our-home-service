import { useState, useEffect } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { todayYMD } from "@/lib/utils/date";
import type { AttendanceStatus, AttendanceStatusType, FamilyMember } from "@/lib/types";

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
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [attendances, setAttendances] = useState<AttendanceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatusType>("HOME");
  const [editReturnTime, setEditReturnTime] = useState("");
  const [editMemo, setEditMemo] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [membersData, attendanceData] = await Promise.all([
          api.get<FamilyMember[]>("/members"),
          api.get<AttendanceStatus[]>(`/attendance?date=${today}`),
        ]);
        setMembers(membersData);
        setAttendances(attendanceData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했어요");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <EmptyState icon="⚠️" message="데이터를 불러오지 못했어요" sub={error} />
  );

  const getAttendance = (memberId: string) =>
    attendances.find((a) => a.date === today && a.memberId === memberId);

  const openModal = (member: FamilyMember) => {
    const att = getAttendance(member.id);
    setSelectedMember(member);
    setEditStatus(att?.status ?? "HOME");
    setEditReturnTime(att?.expectedReturnTime ?? "");
    setEditMemo(att?.memo ?? "");
  };

  const handleSave = async () => {
    if (!selectedMember) return;
    const existing = getAttendance(selectedMember.id);
    try {
      if (existing) {
        const updated = await api.patch<AttendanceStatus>(`/attendance/${existing.id}`, {
          status: editStatus,
          expectedReturnTime: editReturnTime || undefined,
          memo: editMemo || undefined,
        });
        setAttendances((prev) => prev.map((a) => (a.id === existing.id ? updated : a)));
      } else {
        const created = await api.post<AttendanceStatus>("/attendance", {
          date: today,
          memberId: selectedMember.id,
          status: editStatus,
          expectedReturnTime: editReturnTime || undefined,
          memo: editMemo || undefined,
        });
        setAttendances((prev) => [...prev, created]);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장에 실패했어요");
    }
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
          {members.map((member) => {
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
