import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import type { FridgeItem } from "@/lib/types";

export default function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formQuantity, setFormQuantity] = useState("1");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.get<FridgeItem[]>("/fridge");
        setItems(data);
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

  const visibleItems = items
    .filter((item) => !item.isConsumed)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const markConsumed = async (id: string) => {
    try {
      const updated = await api.patch<FridgeItem>(`/fridge/${id}/consume`);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
  };

  const handleAdd = async () => {
    if (!formName.trim()) return;
    try {
      const created = await api.post<FridgeItem>("/fridge", {
        registeredBy: "m1",
        name: formName.trim(),
        category: "OTHER",
        quantity: Number(formQuantity) || 1,
        unit: "개",
        storageType: "FRIDGE",
      });
      setItems((prev) => [created, ...prev]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
    setModalOpen(false);
    setFormName("");
    setFormQuantity("1");
  };

  return (
    <>
      <TopHeader title="냉장고 재고" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto pb-24">
        <div className="mb-4 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">냉장고 재고</h1>
        </div>

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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-base">{item.name}</p>
                    <p className="text-sm text-text-muted mt-0.5">{item.quantity} {item.unit}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markConsumed(item.id)}
                    className="text-xs"
                  >
                    소비완료
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

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
            <label className="block text-sm font-medium text-text-base mb-1.5">수량</label>
            <input
              type="number"
              min="1"
              value={formQuantity}
              onChange={(e) => setFormQuantity(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!formName.trim()}
            className="w-full"
          >
            등록하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
