import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import type { FamilyMember } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  FATHER: "아빠",
  MOTHER: "엄마",
  SON: "아들",
  DAUGHTER: "딸",
  OTHER: "기타",
};

interface NotificationSetting {
  id: string;
  label: string;
  defaultOn: boolean;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: "trash", label: "쓰레기 배출 알림", defaultOn: true },
  { id: "cleaning", label: "청소 담당 알림", defaultOn: true },
  { id: "cleaningReminder", label: "청소 미완료 리마인더", defaultOn: false },
  { id: "parking", label: "차량 주차 위치 알림", defaultOn: true },
  { id: "expiry", label: "유통기한 임박 알림", defaultOn: true },
  { id: "attendance", label: "귀가/외박 변경 알림", defaultOn: false },
  { id: "menu", label: "메뉴 등록 알림", defaultOn: false },
];

const CURRENT_USER_ID = "m1";

export default function SettingsPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(
      NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn])
    )
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.get<FamilyMember[]>("/members");
        setMembers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했어요");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <EmptyState icon="⚠️" message="데이터를 불러오지 못했어요" sub={error} />
  );

  const currentUser = members.find((m) => m.id === CURRENT_USER_ID) ?? members[0];

  return (
    <>
      <TopHeader title="설정" />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto space-y-5">
        <div className="mb-2 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">설정</h1>
        </div>

        {/* 내 프로필 */}
        {currentUser && (
          <section>
            <h2 className="text-sm font-semibold text-text-muted mb-2">내 프로필</h2>
            <Card className="flex items-center gap-4 p-4">
              <Avatar member={currentUser} size="lg" />
              <div>
                <p className="font-semibold text-text-base text-lg">{currentUser.name}</p>
                <Badge variant="primary" className="mt-1">
                  {ROLE_LABELS[currentUser.role]}
                </Badge>
              </div>
            </Card>
          </section>
        )}

        {/* 가족 구성원 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">가족 구성원</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar member={member} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-text-base">{member.name}</p>
                    <p className="text-xs text-text-muted">{ROLE_LABELS[member.role]}</p>
                  </div>
                  {member.id === CURRENT_USER_ID && (
                    <Badge variant="success">나</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 알림 설정 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">알림 설정</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {NOTIFICATION_SETTINGS.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between px-4 py-3.5"
                >
                  <p className="text-sm text-text-base">{setting.label}</p>
                  <Toggle
                    isOn={notifications[setting.id]}
                    onToggle={() => toggleNotification(setting.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 앱 정보 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">앱 정보</h2>
          <Card className="space-y-2">
            <InfoRow label="버전" value="1.0.0" />
            <InfoRow label="개발" value="우리 가족" />
          </Card>
        </section>

        {/* 로그아웃 */}
        <section>
          <button
            onClick={() => { logout(); navigate("/login", { replace: true }); }}
            className="w-full py-4 rounded-2xl bg-white text-danger font-semibold text-sm shadow-sm active:opacity-80 transition-opacity"
          >
            로그아웃
          </button>
        </section>
      </div>
    </>
  );
}

function Toggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}
      aria-label="알림 토글"
    >
      <span
        className={`absolute w-12 h-7 rounded-full transition-colors ${
          isOn ? "bg-primary" : "bg-gray-200"
        }`}
      />
      <span
        className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform ${
          isOn ? "translate-x-2.5" : "-translate-x-2.5"
        }`}
      />
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="text-sm text-text-base">{value}</p>
    </div>
  );
}
