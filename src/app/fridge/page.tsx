"use client";

import { useState } from "react";
import { Plus, Thermometer, Snowflake, Package } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_FRIDGE_ITEMS } from "@/lib/mock";
import { formatDDay, getExpiryStatus } from "@/lib/utils/expiry";
import { todayYMD } from "@/lib/utils/date";
import type { FridgeItem, FridgeCategory, StorageType } from "@/lib/types";

const CATEGORY_LABELS: Record<FridgeCategory, string> = {
  VEGETABLE: "채소",
  MEAT: "육류",
  SEAFOOD: "해산물",
  DAIRY: "유제품",
  DRINK: "음료",
  SIDE_DISH: "반찬",
  SAUCE: "소스",
  OTHER: "기타",
};

const STORAGE_LABELS: Record<StorageType, string> = {
  FRIDGE: "냉장",
  FREEZER: "냉동",
  ROOM_TEMP: "실온",
};

const STORAGE_ICONS: Record<StorageType, React.ReactNode> = {
  FRIDGE: <Thermometer size={14} />,
  FREEZER: <Snowflake size={14} />,
  ROOM_TEMP: <Package size={14} />,
};

const STORAGE_COLOR: Record<StorageType, string> = {
  FRIDGE: "text-blue-500",
  FREEZER: "text-cyan-500",
  ROOM_TEMP: "text-amber-500",
};

type CategoryFilter = "ALL" | FridgeCategory;

const FILTER_CHIPS: { label: string; value: CategoryFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "채소", value: "VEGETABLE" },
  { label: "육류", value: "MEAT" },
  { label: "해산물", value: "SEAFOOD" },
  { label: "유제품", value: "DAIRY" },
  { label: "음료", value: "DRINK" },
  { label: "반찬", value: "SIDE_DISH" },
  { label: "소스", value: "SAUCE" },
  { label: "기타", value: "OTHER" },
];

export default function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>(MOCK_FRIDGE_ITEMS);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<FridgeCategory>("OTHER");
  const [formQuantity, setFormQuantity] = useState("1");
  const [formUnit, setFormUnit] = useState("개");
  const [formExpiry, setFormExpiry] = useState("");
  const [formStorage, setFormStorage] = useState<StorageType>("FRIDGE");

  const visibleItems = items
    .filter((item) => !item.isConsumed)
    .filter((item) => activeFilter === "ALL" || item.category === activeFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const markConsumed = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isConsumed: true } : item))
    );
  };

  const handleAdd = () => {
    if (!formName.trim() || !formExpiry) return;
    setItems((prev) => [
      {
        id: `fi-${Date.now()}`,
        registeredBy: "m1",
        name: formName.trim(),
        category: formCategory,
        quantity: Number(formQuantity) || 1,
        unit: formUnit,
        expirationDate: formExpiry,
        storageType: formStorage,
        isConsumed: false,
        createdAt: `${todayYMD()}T${new Date().toTimeString().slice(0, 8)}`,
      },
      ...prev,
    ]);
    setModalOpen(false);
    setFormName("");
    setFormCategory("OTHER");
    setFormQuantity("1");
    setFormUnit("개");
    setFormExpiry("");
    setFormStorage("FRIDGE");
  };

  const getExpiryBadgeVariant = (expiry: string): "danger" | "warning" | "default" | "success" => {
    const status = getExpiryStatus(expiry);
    if (status === "EXPIRED" || status === "TODAY") return "danger";
    if (status === "IMMINENT") return "warning";
    if (status === "CAUTION") return "default";
    return "success";
  };

  return (
    <>
      <TopHeader title="냉장고 재고" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto pb-24">
        <div className="mb-4 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">냉장고 재고</h1>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-4 px-4">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveFilter(chip.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                activeFilter === chip.value
                  ? "bg-primary text-white"
                  : "bg-white text-text-muted border border-gray-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        {visibleItems.length === 0 ? (
          <EmptyState
            icon="🥢"
            message="등록된 식재료가 없어요"
            sub="+ 버튼을 눌러 추가해보세요"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visibleItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-text-base">{item.name}</p>
                      <Badge variant="default">{CATEGORY_LABELS[item.category]}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <span className={`flex items-center gap-0.5 ${STORAGE_COLOR[item.storageType]}`}>
                        {STORAGE_ICONS[item.storageType]}
                        {STORAGE_LABELS[item.storageType]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getExpiryBadgeVariant(item.expirationDate)}>
                      {formatDDay(item.expirationDate)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markConsumed(item.id)}
                      className="text-xs"
                    >
                      소비완료
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      {/* 등록 Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="식재료 등록">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              이름 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="예: 삼겹살"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">카테고리</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as FridgeCategory)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              {(Object.keys(CATEGORY_LABELS) as FridgeCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">수량</label>
              <input
                type="number"
                min="1"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-base mb-1.5">단위</label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="예: 개, 팩, 병"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              유통기한 <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={formExpiry}
              onChange={(e) => setFormExpiry(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">보관 위치</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STORAGE_LABELS) as StorageType[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setFormStorage(st)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors min-h-[44px] ${
                    formStorage === st
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-text-base"
                  }`}
                >
                  {STORAGE_LABELS[st]}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!formName.trim() || !formExpiry}
            className="w-full"
          >
            등록하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
