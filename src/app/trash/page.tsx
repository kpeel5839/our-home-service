import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_TRASH_SCHEDULES, MOCK_TRASH_RULES } from "@/lib/mock";
import { getMemberById } from "@/lib/mock/members";
import { todayYMD, relativeDay } from "@/lib/utils/date";
import type { TrashSchedule, TrashType } from "@/lib/types";

const TRASH_LABELS: Record<TrashType, string> = {
  GENERAL: "일반",
  RECYCLE: "재활용",
  FOOD: "음식물",
  LARGE: "대형폐기물",
};

const TRASH_BADGE_VARIANT: Record<TrashType, "default" | "success" | "warning" | "primary" | "danger"> = {
  GENERAL: "default",
  RECYCLE: "success",
  FOOD: "warning",
  LARGE: "danger",
};

const DAY_LABELS: Record<number, string> = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

export default function TrashPage() {
  const today = todayYMD();
  const [schedules, setSchedules] = useState<TrashSchedule[]>(MOCK_TRASH_SCHEDULES);

  const todaySchedules = schedules.filter((s) => s.date === today);
  const upcomingSchedules = schedules.filter((s) => s.date > today);

  const toggleComplete = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const renderScheduleItem = (schedule: TrashSchedule) => {
    const member = getMemberById(schedule.memberId);
    const dateLabel = relativeDay(new Date(schedule.date));
    return (
      <div
        key={schedule.id}
        className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
      >
        <button
          onClick={() => toggleComplete(schedule.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
        >
          {schedule.isCompleted ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <Circle size={24} className="text-gray-300" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {schedule.trashTypes.map((type) => (
              <Badge key={type} variant={TRASH_BADGE_VARIANT[type]}>
                {TRASH_LABELS[type]}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-text-muted">{dateLabel}</p>
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
      <TopHeader title="쓰레기 담당" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto space-y-4">
        {/* 오늘 일정 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">오늘</h2>
          <Card className="p-0 overflow-hidden">
            {todaySchedules.length === 0 ? (
              <EmptyState
                icon="🎉"
                message="오늘은 배출일이 아니에요"
                sub="다음 배출일을 확인해보세요"
              />
            ) : (
              <div className="px-4">
                {todaySchedules.map(renderScheduleItem)}
              </div>
            )}
          </Card>
        </section>

        {/* 이번 주 일정 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">이번 주 예정</h2>
          <Card className="p-0 overflow-hidden">
            {upcomingSchedules.length === 0 ? (
              <EmptyState
                message="이번 주 예정된 일정이 없어요"
              />
            ) : (
              <div className="px-4">
                {upcomingSchedules.map(renderScheduleItem)}
              </div>
            )}
          </Card>
        </section>

        {/* 배출 규칙 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">배출 규칙</h2>
          <Card className="space-y-3">
            {MOCK_TRASH_RULES.map((rule) => (
              <div key={rule.dayOfWeek} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {DAY_LABELS[rule.dayOfWeek]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {rule.trashTypes.map((type) => (
                    <Badge key={type} variant={TRASH_BADGE_VARIANT[type]}>
                      {TRASH_LABELS[type]}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </>
  );
}
