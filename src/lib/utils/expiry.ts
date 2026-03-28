import { differenceInDays, parseISO, startOfDay } from "date-fns";

export type ExpiryStatus = "EXPIRED" | "TODAY" | "IMMINENT" | "CAUTION" | "SAFE";

export function calcDDay(expirationDate: string): number {
  const today = startOfDay(new Date());
  const expiry = startOfDay(parseISO(expirationDate));
  return differenceInDays(expiry, today);
}

export function getExpiryStatus(expirationDate: string): ExpiryStatus {
  const dDay = calcDDay(expirationDate);
  if (dDay < 0) return "EXPIRED";
  if (dDay === 0) return "TODAY";
  if (dDay <= 3) return "IMMINENT";
  if (dDay <= 7) return "CAUTION";
  return "SAFE";
}

export function formatDDay(expirationDate: string): string {
  const dDay = calcDDay(expirationDate);
  if (dDay < 0) return `D+${Math.abs(dDay)}`;
  if (dDay === 0) return "D-Day";
  return `D-${dDay}`;
}
