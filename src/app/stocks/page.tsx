import { useState, useEffect } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSymbol, setFormSymbol] = useState("");
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<StockPrice[]>("/stocks");
      setStocks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!formSymbol.trim() || !formName.trim()) return;
    try {
      setSaving(true);
      await api.post("/stocks", {
        symbol: formSymbol.trim().toUpperCase(),
        name: formName.trim(),
        displayOrder: stocks.length,
      });
      setModalOpen(false);
      setFormSymbol("");
      setFormName("");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "추가에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (symbol: string) => {
    if (!confirm(`${symbol} 종목을 삭제할까요?`)) return;
    try {
      await api.delete(`/stocks/${symbol}`);
      setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했어요");
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "KRW") return `₩${price.toLocaleString("ko-KR")}`;
    return `$${price.toFixed(2)}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <EmptyState icon="⚠️" message="데이터를 불러오지 못했어요" sub={error} />
  );

  return (
    <>
      <TopHeader title="주식" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto pb-24">
        <div className="mb-4 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">주식</h1>
        </div>

        {stocks.length === 0 ? (
          <EmptyState
            icon="📈"
            message="관심 종목이 없어요"
            sub="+ 버튼을 눌러 종목을 추가해보세요"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {stocks.map((stock) => {
              const isUp = stock.change >= 0;
              return (
                <Card key={stock.symbol} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-base">{stock.name}</p>
                        <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                          {stock.symbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-text-base">
                          {formatPrice(stock.price, stock.currency)}
                        </p>
                        <div className={`flex items-center gap-0.5 text-sm font-medium ${isUp ? "text-red-500" : "text-blue-500"}`}>
                          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>
                            {isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(stock.symbol)}
                      className="p-2 text-text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <p className="text-xs text-text-muted text-center mt-4">Yahoo Finance 기준 · 실시간이 아닐 수 있어요</p>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="종목 추가">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              티커 심볼 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formSymbol}
              onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
              placeholder="예: AAPL, 005930.KS"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-text-muted mt-1">미국 주식: AAPL · 한국 주식: 005930.KS</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              표시 이름 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="예: 애플, 삼성전자"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!formSymbol.trim() || !formName.trim() || saving}
            className="w-full"
          >
            {saving ? "추가 중..." : "추가하기"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
