import { format, addDays, isToday, isTomorrow } from "date-fns";
import { ko } from "date-fns/locale";

export function toYMD(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function todayYMD(): string {
  return toYMD(new Date());
}

export function relativeDay(date: Date): string {
  if (isToday(date)) return "오늘";
  if (isTomorrow(date)) return "내일";
  return format(date, "M월 d일 (E)", { locale: ko });
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "M월 d일 (E)", { locale: ko });
}

export function formatTime(isoStr: string): string {
  return format(new Date(isoStr), "HH:mm");
}

export function offsetDate(days: number): string {
  return toYMD(addDays(new Date(), days));
}
