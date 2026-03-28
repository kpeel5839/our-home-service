import {
  UtensilsCrossed, Trash2, Users, Car,
  Refrigerator, SprayCanIcon as Spray
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MEMBERS, getMemberById } from "@/lib/mock/members";
import {
  MOCK_MENUS, MOCK_TRASH_SCHEDULES, MOCK_ATTENDANCE,
  MOCK_RESERVATIONS, MOCK_FRIDGE_ITEMS, MOCK_CLEANING_TASKS
} from "@/lib/mock";
import { todayYMD, formatTime } from "@/lib/utils/date";
import { formatDDay, getExpiryStatus } from "@/lib/utils/expiry";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const MEAL_LABEL = { BREAKFAST: "아침", LUNCH: "점심", DINNER: "저녁" };

const ATTENDANCE_STYLE: Record<string, { text: string; color: string }> = {
  HOME: { text: "귀가 예정", color: "text-green-600" },
  OUT: { text: "외박", color: "text-blue-500" },
  UNKNOWN: { text: "미정", color: "text-text-muted" },
};

export default function HomePage() {
  const today = todayYMD();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "좋은 아침이에요" : hour < 18 ? "좋은 오후예요" : "좋은 저녁이에요";
  const dateLabel = format(now, "M월 d일 (E)", { locale: ko });

  const todayMenus = MOCK_MENUS.filter((m) => m.date === today);
  const todayTrash = MOCK_TRASH_SCHEDULES.find((t) => t.date === today);
  const trashMember = todayTrash ? getMemberById(todayTrash.memberId) : null;
  const todayAttendance = MOCK_ATTENDANCE.filter((a) => a.date === today);
  const todayReservations = MOCK_RESERVATIONS.filter((r) => r.startTime.startsWith(today));
  const imminentItems = MOCK_FRIDGE_ITEMS.filter(
    (i) => !i.isConsumed && ["EXPIRED", "TODAY", "IMMINENT"].includes(getExpiryStatus(i.expirationDate))
  ).slice(0, 3);
  const todayDow = now.getDay();
  const todayCleanings = MOCK_CLEANING_TASKS.filter(
    (t) => t.frequency === "DAILY" || (t.frequency === "WEEKLY" && t.dayOfWeek === todayDow)
  );

  return (
    <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto">
      {/* 인사 헤더 */}
      <div className="mb-6">
        <p className="text-text-muted text-sm">{dateLabel}</p>
        <h1 className="text-2xl font-bold text-text-base mt-0.5">{greeting} 👋</h1>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        {/* 오늘의 메뉴 */}
        <DashboardCard title="오늘의 메뉴" icon={<UtensilsCrossed size={18} />} href="/menu" accentColor="#FF8C69">
          {todayMenus.length === 0 ? (
            <p className="text-sm text-text-muted">아직 등록된 메뉴가 없어요</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {(["BREAKFAST", "LUNCH", "DINNER"] as const).map((type) => {
                const menu = todayMenus.find((m) => m.mealType === type);
                return (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted w-8 shrink-0">{MEAL_LABEL[type]}</span>
                    <span className={menu ? "text-text-base font-medium" : "text-gray-300"}>
                      {menu ? menu.menuName : "미정"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>

        {/* 쓰레기 담당 */}
        <DashboardCard title="오늘 쓰레기 담당" icon={<Trash2 size={18} />} href="/trash" accentColor="#90D5A8">
          {!todayTrash ? (
            <p className="text-sm text-text-muted">오늘은 배출일이 아니에요</p>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {trashMember && <Avatar member={trashMember} size="sm" />}
                <div>
                  <p className="text-sm font-medium">{trashMember?.name}</p>
                  <p className="text-xs text-text-muted">{todayTrash.trashTypes.join(" · ")}</p>
                </div>
              </div>
              <Badge variant={todayTrash.isCompleted ? "success" : "warning"}>
                {todayTrash.isCompleted ? "완료" : "미완료"}
              </Badge>
            </div>
          )}
        </DashboardCard>

        {/* 가족 현황 */}
        <DashboardCard title="가족 현황" icon={<Users size={18} />} href="/attendance" accentColor="#A8D8EA">
          <div className="grid grid-cols-2 gap-2">
            {MOCK_MEMBERS.map((member) => {
              const att = todayAttendance.find((a) => a.memberId === member.id);
              const style = ATTENDANCE_STYLE[att?.status ?? "UNKNOWN"];
              return (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar member={member} size="sm" />
                  <div>
                    <p className="text-xs font-medium">{member.name}</p>
                    <p className={`text-xs ${style.color}`}>{style.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* 차량 예약 */}
        <DashboardCard title="오늘 차량 예약" icon={<Car size={18} />} href="/vehicle/reserve" accentColor="#FFD580">
          {todayReservations.length === 0 ? (
            <p className="text-sm text-text-muted">오늘 예약 없음</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todayReservations.map((r) => {
                const member = getMemberById(r.memberId);
                return (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    {member && <Avatar member={member} size="sm" />}
                    <div>
                      <p className="font-medium">{member?.name}</p>
                      <p className="text-xs text-text-muted">
                        {formatTime(r.startTime)} ~ {formatTime(r.endTime)} · {r.purpose}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>

        {/* 유통기한 임박 */}
        <DashboardCard title="유통기한 임박" icon={<Refrigerator size={18} />} href="/fridge" accentColor="#FF8080">
          {imminentItems.length === 0 ? (
            <p className="text-sm text-text-muted">임박한 식품이 없어요 🎉</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {imminentItems.map((item) => {
                const status = getExpiryStatus(item.expirationDate);
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <Badge variant={status === "CAUTION" ? "warning" : "danger"}>
                      {formatDDay(item.expirationDate)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>

        {/* 오늘 청소 */}
        <DashboardCard title="오늘 청소 담당" icon={<Spray size={18} />} href="/cleaning" accentColor="#C4B5FD">
          {todayCleanings.length === 0 ? (
            <p className="text-sm text-text-muted">오늘은 청소 없는 날이에요</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {todayCleanings.map((task) => {
                const member = getMemberById(task.assignedMemberId);
                return (
                  <div key={task.id} className="flex items-center justify-between text-sm">
                    <span>{task.name}</span>
                    <div className="flex items-center gap-1.5">
                      {member && <Avatar member={member} size="sm" />}
                      <span className="text-xs text-text-muted">{member?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
