"use client";

import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MEMBERS } from "@/lib/mock/members";

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

// 현재 사용자 (첫 번째 멤버 아빠)
const CURRENT_USER = MOCK_MEMBERS[0];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(
      NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultOn])
    )
  );

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <TopHeader title="설정" />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto space-y-5">
        <div className="mb-2 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">설정</h1>
        </div>

        {/* 내 프로필 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">내 프로필</h2>
          <Card className="flex items-center gap-4 p-4">
            <Avatar member={CURRENT_USER} size="lg" />
            <div>
              <p className="font-semibold text-text-base text-lg">{CURRENT_USER.name}</p>
              <Badge variant="primary" className="mt-1">
                {ROLE_LABELS[CURRENT_USER.role]}
              </Badge>
            </div>
          </Card>
        </section>

        {/* 가족 구성원 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">가족 구성원</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {MOCK_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar member={member} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-text-base">{member.name}</p>
                    <p className="text-xs text-text-muted">{ROLE_LABELS[member.role]}</p>
                  </div>
                  {member.id === CURRENT_USER.id && (
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
