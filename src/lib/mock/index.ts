import { offsetDate } from "@/lib/utils/date";
import type {
  DailyMenu,
  TrashSchedule,
  ApartmentTrashRule,
  CleaningTask,
  AttendanceStatus,
  Vehicle,
  VehicleReservation,
  FuelRecord,
  ParkingRecord,
  Post,
  FridgeItem,
} from "@/lib/types";

// --- 메뉴 ---
export const MOCK_MENUS: DailyMenu[] = [
  { id: "mn1", date: offsetDate(0), mealType: "BREAKFAST", menuName: "토스트 & 계란후라이", registeredBy: "m2" },
  { id: "mn2", date: offsetDate(0), mealType: "LUNCH", menuName: "된장찌개 & 흰밥", registeredBy: "m2" },
  { id: "mn3", date: offsetDate(-1), mealType: "DINNER", menuName: "삼겹살", registeredBy: "m1" },
];

// --- 쓰레기 ---
export const MOCK_TRASH_RULES: ApartmentTrashRule[] = [
  { dayOfWeek: 1, trashTypes: ["GENERAL", "RECYCLE"] }, // 월
  { dayOfWeek: 3, trashTypes: ["GENERAL", "FOOD"] },    // 수
  { dayOfWeek: 5, trashTypes: ["RECYCLE", "FOOD"] },    // 금
];

export const MOCK_TRASH_SCHEDULES: TrashSchedule[] = [
  { id: "t1", date: offsetDate(0), memberId: "m3", trashTypes: ["GENERAL", "RECYCLE"], isCompleted: false },
  { id: "t2", date: offsetDate(2), memberId: "m4", trashTypes: ["GENERAL", "FOOD"], isCompleted: false },
  { id: "t3", date: offsetDate(-1), memberId: "m1", trashTypes: ["RECYCLE", "FOOD"], isCompleted: true },
];

// --- 청소 ---
export const MOCK_CLEANING_TASKS: CleaningTask[] = [
  { id: "c1", name: "화장실 청소", frequency: "WEEKLY", dayOfWeek: 6, assignedMemberId: "m3" },
  { id: "c2", name: "거실 청소기", frequency: "WEEKLY", dayOfWeek: 3, assignedMemberId: "m4" },
  { id: "c3", name: "설거지", frequency: "DAILY", assignedMemberId: "m2" },
  { id: "c4", name: "분리수거 정리", frequency: "WEEKLY", dayOfWeek: 4, assignedMemberId: "m1" },
];

// --- 귀가/외박 ---
export const MOCK_ATTENDANCE: AttendanceStatus[] = [
  { id: "a1", date: offsetDate(0), memberId: "m1", status: "HOME", expectedReturnTime: "19:00" },
  { id: "a2", date: offsetDate(0), memberId: "m2", status: "HOME" },
  { id: "a3", date: offsetDate(0), memberId: "m3", status: "OUT", memo: "친구 집에서 잠" },
  { id: "a4", date: offsetDate(0), memberId: "m4", status: "UNKNOWN" },
];

// --- 차량 ---
export const MOCK_VEHICLES: Vehicle[] = [
  { id: "v1", name: "아빠 차", plateNumber: "12가 3456" },
];

export const MOCK_RESERVATIONS: VehicleReservation[] = [
  { id: "r1", vehicleId: "v1", memberId: "m1", startTime: `${offsetDate(0)}T09:00:00`, endTime: `${offsetDate(0)}T12:00:00`, purpose: "마트 장보기" },
  { id: "r2", vehicleId: "v1", memberId: "m3", startTime: `${offsetDate(1)}T14:00:00`, endTime: `${offsetDate(1)}T18:00:00`, purpose: "친구 픽업" },
];

export const MOCK_FUEL_RECORDS: FuelRecord[] = [
  { id: "f1", vehicleId: "v1", memberId: "m1", date: offsetDate(-3), liters: 45, amount: 75600, stationName: "GS칼텍스 강남점" },
  { id: "f2", vehicleId: "v1", memberId: "m1", date: offsetDate(-14), liters: 40, amount: 67200, stationName: "SK에너지 서초점" },
];

export const MOCK_PARKING_RECORDS: ParkingRecord[] = [
  { id: "p1", vehicleId: "v1", memberId: "m1", floor: "B2", zone: "A-12", memo: "엘리베이터 근처", recordedAt: `${offsetDate(0)}T12:30:00` },
];

// --- 커뮤니티 ---
export const MOCK_POSTS: Post[] = [
  {
    id: "po1",
    authorId: "m2",
    content: "오늘 저녁 삼겹살 파티 🥓 맛있었다! 다음에 또 하자~",
    images: ["https://picsum.photos/seed/family1/600/400"],
    createdAt: `${offsetDate(-1)}T20:00:00`,
    likes: ["m1", "m3"],
    comments: [
      { id: "cm1", postId: "po1", authorId: "m3", content: "저도 맛있었어요!", createdAt: `${offsetDate(-1)}T20:30:00` },
    ],
  },
  {
    id: "po2",
    authorId: "m4",
    content: "오늘 학교에서 그린 그림이에요 ☺️",
    images: ["https://picsum.photos/seed/family2/600/400", "https://picsum.photos/seed/family3/600/400"],
    createdAt: `${offsetDate(-2)}T16:00:00`,
    likes: ["m1", "m2"],
    comments: [],
  },
];

// --- 냉장고 ---
export const MOCK_FRIDGE_ITEMS: FridgeItem[] = [
  { id: "fi1", registeredBy: "m2", name: "삼겹살", category: "MEAT", quantity: 2, unit: "팩", expirationDate: offsetDate(2), storageType: "FREEZER", isConsumed: false, createdAt: `${offsetDate(-1)}T10:00:00` },
  { id: "fi2", registeredBy: "m2", name: "우유", category: "DAIRY", quantity: 1, unit: "개", expirationDate: offsetDate(5), storageType: "FRIDGE", isConsumed: false, createdAt: `${offsetDate(-2)}T09:00:00` },
  { id: "fi3", registeredBy: "m2", name: "깻잎 반찬", category: "SIDE_DISH", quantity: 1, unit: "통", expirationDate: offsetDate(1), storageType: "FRIDGE", isConsumed: false, createdAt: `${offsetDate(0)}T11:00:00` },
  { id: "fi4", registeredBy: "m1", name: "오렌지 주스", category: "DRINK", quantity: 2, unit: "병", expirationDate: offsetDate(14), storageType: "FRIDGE", isConsumed: false, createdAt: `${offsetDate(-3)}T15:00:00` },
  { id: "fi5", registeredBy: "m2", name: "된장", category: "SAUCE", quantity: 1, unit: "통", expirationDate: offsetDate(180), storageType: "ROOM_TEMP", isConsumed: false, createdAt: `${offsetDate(-7)}T12:00:00` },
];
