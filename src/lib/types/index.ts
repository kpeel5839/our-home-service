export type { FamilyMember, MemberRole } from "./member";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

export interface DailyMenu {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  menuName: string;
  description?: string;
  registeredBy: string; // memberId
}

export type TrashType = "GENERAL" | "RECYCLE" | "FOOD" | "LARGE";

export interface TrashSchedule {
  id: string;
  date: string;
  memberId: string;
  trashTypes: TrashType[];
  isCompleted: boolean;
}

export interface ApartmentTrashRule {
  dayOfWeek: number; // 0=일 ~ 6=토
  trashTypes: TrashType[];
}

export type CleaningFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export interface CleaningTask {
  id: string;
  name: string;
  frequency: CleaningFrequency;
  dayOfWeek?: number;
  assignedMemberId: string;
}

export interface CleaningAssignment {
  id: string;
  taskId: string;
  memberId: string;
  scheduledDate: string;
  isCompleted: boolean;
}

export type AttendanceStatusType = "HOME" | "OUT" | "UNKNOWN";

export interface AttendanceStatus {
  id: string;
  date: string;
  memberId: string;
  status: AttendanceStatusType;
  expectedReturnTime?: string;
  memo?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
}

export interface VehicleReservation {
  id: string;
  vehicleId: string;
  memberId: string;
  startTime: string; // ISO
  endTime: string;
  purpose?: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  memberId: string;
  date: string;
  liters: number;
  amount: number;
  stationName?: string;
}

export interface ParkingRecord {
  id: string;
  vehicleId: string;
  memberId: string;
  floor: string;
  zone?: string;
  memo?: string;
  recordedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images: string[];
  createdAt: string;
  likes: string[]; // memberIds
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export type StorageType = "FRIDGE" | "FREEZER" | "ROOM_TEMP";
export type FridgeCategory =
  | "VEGETABLE"
  | "MEAT"
  | "SEAFOOD"
  | "DAIRY"
  | "DRINK"
  | "SIDE_DISH"
  | "SAUCE"
  | "OTHER";

export interface FridgeItem {
  id: string;
  registeredBy: string;
  name: string;
  category: FridgeCategory;
  quantity: number;
  unit: string;
  expirationDate: string; // YYYY-MM-DD
  storageType: StorageType;
  isConsumed: boolean;
  createdAt: string;
}
