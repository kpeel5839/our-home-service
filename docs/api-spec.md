# 가족 홈 서비스 — 백엔드 API 구현 명세

## 공통 규칙

- **Base URL:** `/api`
- **인증:** 모든 요청에 `familyId` 기반 multi-tenant 구조 (추후 논의)
- **응답 형식:** `Content-Type: application/json`
- **날짜 형식:** `YYYY-MM-DD` (날짜), ISO 8601 (일시)
- **에러 응답:**
  ```json
  { "error": "메시지", "code": "ERROR_CODE" }
  ```

---

## 데이터 모델

### FamilyMember
```typescript
{
  id: string;
  name: string;
  role: "FATHER" | "MOTHER" | "SON" | "DAUGHTER" | "OTHER";
  avatarColor: string;   // hex color
  avatarUrl?: string;
}
```

### DailyMenu
```typescript
{
  id: string;
  date: string;          // YYYY-MM-DD
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  menuName: string;
  description?: string;
  registeredBy: string;  // memberId
}
```

### TrashSchedule
```typescript
{
  id: string;
  date: string;
  memberId: string;
  trashTypes: ("GENERAL" | "RECYCLE" | "FOOD" | "LARGE")[];
  isCompleted: boolean;
}
```

### ApartmentTrashRule
```typescript
{
  id: string;
  dayOfWeek: number;     // 0=일 ~ 6=토
  trashTypes: ("GENERAL" | "RECYCLE" | "FOOD" | "LARGE")[];
}
```

### CleaningTask
```typescript
{
  id: string;
  name: string;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  dayOfWeek?: number;
  assignedMemberId: string;
}
```

### CleaningAssignment
```typescript
{
  id: string;
  taskId: string;
  memberId: string;
  scheduledDate: string;
  isCompleted: boolean;
}
```

### AttendanceStatus
```typescript
{
  id: string;
  date: string;
  memberId: string;
  status: "HOME" | "OUT" | "UNKNOWN";
  expectedReturnTime?: string;  // ISO
  memo?: string;
}
```

### Vehicle
```typescript
{
  id: string;
  name: string;
  plateNumber: string;
}
```

### VehicleReservation
```typescript
{
  id: string;
  vehicleId: string;
  memberId: string;
  startTime: string;   // ISO
  endTime: string;     // ISO
  purpose?: string;
}
```

### FuelRecord
```typescript
{
  id: string;
  vehicleId: string;
  memberId: string;
  date: string;
  liters: number;
  amount: number;
  stationName?: string;
}
```

### ParkingRecord
```typescript
{
  id: string;
  vehicleId: string;
  memberId: string;
  floor: string;
  zone?: string;
  memo?: string;
  recordedAt: string;  // ISO
}
```

### FridgeItem
```typescript
{
  id: string;
  registeredBy: string;
  name: string;
  category: "VEGETABLE" | "MEAT" | "SEAFOOD" | "DAIRY" | "DRINK" | "SIDE_DISH" | "SAUCE" | "OTHER";
  quantity: number;
  unit: string;
  expirationDate: string;    // YYYY-MM-DD
  storageType: "FRIDGE" | "FREEZER" | "ROOM_TEMP";
  isConsumed: boolean;
  createdAt: string;          // ISO
}
```

### Post
```typescript
{
  id: string;
  authorId: string;
  content: string;
  images: string[];       // URL 목록
  createdAt: string;      // ISO
  likes: string[];        // memberId 목록
  comments: Comment[];
}
```

### Comment
```typescript
{
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;      // ISO
}
```

---

## API 엔드포인트

---

### 1. 가족 구성원 (Members)

#### `GET /api/members`
가족 구성원 전체 조회

**응답 `200`**
```json
[FamilyMember, ...]
```

---

### 2. 식단 (Menu)

#### `GET /api/menus?date=YYYY-MM-DD`
특정 날짜 식단 조회 (breakfast/lunch/dinner 최대 3개)

**응답 `200`**
```json
[DailyMenu, ...]
```

#### `POST /api/menus`
식단 등록

**요청 Body**
```json
{
  "date": "2026-03-28",
  "mealType": "BREAKFAST",
  "menuName": "토스트",
  "description": "계란 토스트",
  "registeredBy": "m1"
}
```

**응답 `201`** → 생성된 `DailyMenu`

#### `PUT /api/menus/:id`
식단 수정

**요청 Body** — 수정할 필드만 포함 (menuName, description)

**응답 `200`** → 수정된 `DailyMenu`

#### `DELETE /api/menus/:id`
식단 삭제

**응답 `204`**

---

### 3. 쓰레기 (Trash)

#### `GET /api/trash/rules`
아파트 쓰레기 배출 규칙 전체 조회

**응답 `200`**
```json
[ApartmentTrashRule, ...]
```

#### `GET /api/trash/schedules?date=YYYY-MM-DD`
특정 날짜 쓰레기 배출 일정 조회

**응답 `200`**
```json
[TrashSchedule, ...]
```

#### `POST /api/trash/schedules`
쓰레기 배출 일정 등록

**요청 Body**
```json
{
  "date": "2026-03-28",
  "memberId": "m1",
  "trashTypes": ["GENERAL", "RECYCLE"]
}
```

**응답 `201`** → 생성된 `TrashSchedule`

#### `PATCH /api/trash/schedules/:id/complete`
배출 완료 토글

**응답 `200`** → 수정된 `TrashSchedule`

---

### 4. 청소 (Cleaning)

#### `GET /api/cleaning/tasks`
청소 업무 목록 전체 조회

**응답 `200`**
```json
[CleaningTask, ...]
```

#### `POST /api/cleaning/tasks`
청소 업무 등록

**요청 Body**
```json
{
  "name": "욕실 청소",
  "frequency": "WEEKLY",
  "dayOfWeek": 6,
  "assignedMemberId": "m2"
}
```

**응답 `201`** → 생성된 `CleaningTask`

#### `PATCH /api/cleaning/tasks/:id`
청소 업무 수정

**요청 Body** — 수정할 필드만 포함 (name, frequency, dayOfWeek, assignedMemberId)

**응답 `200`** → 수정된 `CleaningTask`

#### `DELETE /api/cleaning/tasks/:id`
청소 업무 삭제

**응답 `204`**

#### `GET /api/cleaning/assignments?date=YYYY-MM-DD`
특정 날짜의 청소 할당 목록 조회

**응답 `200`**
```json
[CleaningAssignment, ...]
```

#### `PATCH /api/cleaning/assignments/:id/complete`
청소 완료 토글

**응답 `200`** → 수정된 `CleaningAssignment`

---

### 5. 외출/귀가 (Attendance)

#### `GET /api/attendance?date=YYYY-MM-DD`
특정 날짜 가족 구성원별 상태 조회

**응답 `200`**
```json
[AttendanceStatus, ...]
```

#### `POST /api/attendance`
상태 등록

**요청 Body**
```json
{
  "date": "2026-03-28",
  "memberId": "m1",
  "status": "OUT",
  "expectedReturnTime": "2026-03-28T21:00:00+09:00",
  "memo": "야근"
}
```

**응답 `201`** → 생성된 `AttendanceStatus`

#### `PATCH /api/attendance/:id`
상태 수정

**요청 Body** — 수정할 필드만 포함 (status, expectedReturnTime, memo)

**응답 `200`** → 수정된 `AttendanceStatus`

---

### 6. 차량 (Vehicle)

#### `GET /api/vehicles`
차량 목록 조회

**응답 `200`**
```json
[Vehicle, ...]
```

#### `POST /api/vehicles`
차량 등록

**요청 Body**
```json
{
  "name": "아빠 차",
  "plateNumber": "12가 3456"
}
```

**응답 `201`** → 생성된 `Vehicle`

---

### 7. 차량 예약 (Vehicle Reservation)

#### `GET /api/vehicles/:vehicleId/reservations`
차량별 예약 목록 조회

**응답 `200`**
```json
[VehicleReservation, ...]
```

#### `POST /api/vehicles/:vehicleId/reservations`
예약 등록

> **검증:** `startTime ~ endTime` 이 기존 예약과 겹치면 `409 Conflict` 반환

**요청 Body**
```json
{
  "memberId": "m1",
  "startTime": "2026-03-29T10:00:00+09:00",
  "endTime": "2026-03-29T13:00:00+09:00",
  "purpose": "마트 장보기"
}
```

**응답 `201`** → 생성된 `VehicleReservation`

#### `DELETE /api/vehicles/:vehicleId/reservations/:id`
예약 취소

**응답 `204`**

---

### 8. 주유 기록 (Fuel Records)

#### `GET /api/vehicles/:vehicleId/fuel`
차량별 주유 기록 조회

**응답 `200`**
```json
[FuelRecord, ...]
```

#### `POST /api/vehicles/:vehicleId/fuel`
주유 기록 등록

**요청 Body**
```json
{
  "memberId": "m1",
  "date": "2026-03-28",
  "liters": 45.2,
  "amount": 72000,
  "stationName": "GS칼텍스 강남점"
}
```

**응답 `201`** → 생성된 `FuelRecord`

---

### 9. 주차 위치 (Parking Records)

#### `GET /api/vehicles/:vehicleId/parking/latest`
차량별 최근 주차 위치 1건 조회

**응답 `200`** → `ParkingRecord` 1건

#### `POST /api/vehicles/:vehicleId/parking`
주차 위치 등록

**요청 Body**
```json
{
  "memberId": "m1",
  "floor": "B2",
  "zone": "A-12",
  "memo": "엘리베이터 앞"
}
```

**응답 `201`** → 생성된 `ParkingRecord`

---

### 10. 냉장고 (Fridge)

#### `GET /api/fridge`
식품 목록 조회

**쿼리 파라미터**
- `storageType`: `FRIDGE` | `FREEZER` | `ROOM_TEMP` (없으면 전체)
- 소비 완료된 항목(`isConsumed: true`)은 기본 제외

**응답 `200`**
```json
[FridgeItem, ...]
```

#### `POST /api/fridge`
식품 등록

**요청 Body**
```json
{
  "registeredBy": "m2",
  "name": "우유",
  "category": "DAIRY",
  "quantity": 1,
  "unit": "개",
  "expirationDate": "2026-04-05",
  "storageType": "FRIDGE"
}
```

**응답 `201`** → 생성된 `FridgeItem`

#### `PATCH /api/fridge/:id/consume`
소비 완료 처리 (`isConsumed = true`)

**응답 `200`** → 수정된 `FridgeItem`

#### `DELETE /api/fridge/:id`
아이템 삭제

**응답 `204`**

---

### 11. 커뮤니티 (Community)

#### `GET /api/posts`
게시글 목록 조회 (최신순, 커서 페이지네이션)

**쿼리 파라미터**
- `limit`: 페이지 크기 (기본 20)
- `cursor`: 마지막으로 받은 post id

**응답 `200`**
```json
{
  "posts": [Post, ...],
  "nextCursor": "post_id 또는 null"
}
```

#### `POST /api/posts`
게시글 작성

**요청 Body**
```json
{
  "authorId": "m1",
  "content": "오늘 저녁 맛있었다!",
  "images": ["https://..."]
}
```

**응답 `201`** → 생성된 `Post`

#### `GET /api/posts/:id`
게시글 단건 조회 (댓글 포함)

**응답 `200`** → `Post` (comments 포함)

#### `PATCH /api/posts/:id/like`
좋아요 토글 (있으면 취소, 없으면 추가)

**요청 Body**
```json
{ "memberId": "m1" }
```

**응답 `200`**
```json
{ "likes": ["m1", "m2"] }
```

#### `POST /api/posts/:id/comments`
댓글 작성

**요청 Body**
```json
{
  "authorId": "m2",
  "content": "동감이야!"
}
```

**응답 `201`** → 생성된 `Comment`

#### `DELETE /api/posts/:id/comments/:commentId`
댓글 삭제

**응답 `204`**

---

## 구현 우선순위

| 순위 | 기능 | 이유 |
|---|---|---|
| 1 | Members | 모든 기능의 기반 |
| 2 | Attendance | 매일 사용, 단순 CRUD |
| 3 | Menu | 매일 사용, 단순 CRUD |
| 4 | Trash | 매일 사용, 단순 CRUD |
| 5 | Fridge | 중요도 높음 |
| 6 | Cleaning | 중요도 높음 |
| 7 | Vehicle 전체 | 예약 겹침 검증 등 복잡도 있음 |
| 8 | Community | 이미지 업로드 등 인프라 필요 |
