import { useState, useEffect } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { todayYMD } from "@/lib/utils/date";
import type { DailyMenu, MealType, FamilyMember } from "@/lib/types";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
};

const MEAL_EMOJI: Record<MealType, string> = {
  BREAKFAST: "🌅",
  LUNCH: "☀️",
  DINNER: "🌙",
};

export default function MenuPage() {
  const today = todayYMD();
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMealType, setEditingMealType] = useState<MealType | null>(null);
  const [menuName, setMenuName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [data, membersData] = await Promise.all([
          api.get<DailyMenu[]>(`/menus?date=${today}`),
          api.get<FamilyMember[]>("/members"),
        ]);
        setMenus(data);
        setMembers(membersData);
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

  const todayMenus = menus.filter((m) => m.date === today);

  const getMenu = (mealType: MealType) =>
    todayMenus.find((m) => m.mealType === mealType);

  const openModal = (mealType: MealType) => {
    const existing = getMenu(mealType);
    setEditingMealType(mealType);
    setMenuName(existing?.menuName ?? "");
    setDescription(existing?.description ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingMealType || !menuName.trim()) return;
    const existing = getMenu(editingMealType);
    try {
      if (existing) {
        const updated = await api.put<DailyMenu>(`/menus/${existing.id}`, {
          menuName: menuName.trim(),
          description: description.trim() || undefined,
        });
        setMenus((prev) => prev.map((m) => (m.id === existing.id ? updated : m)));
      } else {
        const created = await api.post<DailyMenu>("/menus", {
          date: today,
          mealType: editingMealType,
          menuName: menuName.trim(),
          description: description.trim() || undefined,
          registeredBy: "m1",
        });
        setMenus((prev) => [...prev, created]);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장에 실패했어요");
    }
    setModalOpen(false);
    setMenuName("");
    setDescription("");
    setEditingMealType(null);
  };

  return (
    <>
      <TopHeader title="오늘의 메뉴" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto">
        <div className="mb-5 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">오늘의 메뉴</h1>
        </div>
        <div className="flex flex-col gap-3">
          {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((mealType) => {
            const menu = getMenu(mealType);
            const registeredBy = menu ? members.find((m) => m.id === menu.registeredBy) : null;
            return (
              <Card key={mealType} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{MEAL_EMOJI[mealType]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-muted mb-1">
                        {MEAL_LABELS[mealType]}
                      </p>
                      {menu ? (
                        <>
                          <p className="font-semibold text-text-base truncate">
                            {menu.menuName}
                          </p>
                          {menu.description && (
                            <p className="text-xs text-text-muted mt-0.5 truncate">
                              {menu.description}
                            </p>
                          )}
                          {registeredBy && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <Avatar member={registeredBy} size="sm" />
                              <span className="text-xs text-text-muted">
                                {registeredBy.name}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-300">아직 미등록</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={menu ? "ghost" : "secondary"}
                    size="sm"
                    onClick={() => openModal(mealType)}
                    className="flex-shrink-0"
                  >
                    {menu ? "수정" : "등록하기"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editingMealType ? MEAL_LABELS[editingMealType] : ""} 메뉴 ${getMenu(editingMealType!) ? "수정" : "등록"}`}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              메뉴명 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="예: 된장찌개 & 흰밥"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              메모 (선택)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 매운 거 빼줘요"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!menuName.trim()}
            className="w-full"
          >
            저장하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
