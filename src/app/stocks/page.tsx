import { useState, useEffect } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface IndexData { name: string; value: string; change: string; changeRate: string }
interface ExchangeData { name: string; value: string; change: string }
interface BondData { name: string; value: string }
interface MarketData {
  stockIndices: Record<string, IndexData>;
  exchangeRates: Record<string, ExchangeData>;
  bondRates: Record<string, BondData>;
}
interface StockPrice {
  symbol: string; name: string; price: number;
  change: number; changePercent: number; currency: string;
}

export default function StocksPage() {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSymbol, setFormSymbol] = useState("");
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const [marketData, stocksData] = await Promise.all([
        api.get<MarketData>("/market"),
        api.get<StockPrice[]>("/stocks"),
      ]);
      setMarket(marketData);
      setStocks(stocksData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      await load(true);
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

  const isUp = (change: string) => !change.startsWith("-");

  const formatPrice = (price: number, currency: string) =>
    currency === "KRW" ? `₩${price.toLocaleString("ko-KR")}` : `$${price.toFixed(2)}`;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return <EmptyState icon="⚠️" message="데이터를 불러오지 못했어요" sub={error} />;

  return (
    <>
      <TopHeader title="시장 현황" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto pb-24 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-base hidden lg:block">시장 현황</h1>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="ml-auto flex items-center gap-1.5 text-xs text-text-muted"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            새로고침
          </button>
        </div>

        {/* 주가 지수 */}
        {market && (
          <>
            <section>
              <h2 className="text-sm font-semibold text-text-muted mb-2">주가 지수</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(market.stockIndices).map((idx) => (
                  <Card key={idx.name} className="p-3 text-center">
                    <p className="text-xs text-text-muted mb-1">{idx.name}</p>
                    <p className="font-bold text-text-base text-sm">{idx.value}</p>
                    <p className={`text-xs mt-0.5 ${isUp(idx.change) ? "text-red-500" : "text-blue-500"}`}>
                      {isUp(idx.change) ? "▲" : "▼"} {idx.changeRate}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* 환율 */}
            <section>
              <h2 className="text-sm font-semibold text-text-muted mb-2">환율</h2>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {Object.values(market.exchangeRates).map((fx) => (
                    <div key={fx.name} className="flex items-center justify-between px-4 py-3">
                      <p className="text-sm text-text-base">{fx.name}</p>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-text-base">{fx.value}</p>
                        <p className={`text-xs ${isUp(fx.change) ? "text-red-500" : "text-blue-500"}`}>
                          {isUp(fx.change) ? "▲" : "▼"} {fx.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 국채 금리 */}
            <section>
              <h2 className="text-sm font-semibold text-text-muted mb-2">국채 금리</h2>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {Object.values(market.bondRates).map((bond) => (
                    <div key={bond.name} className="flex items-center justify-between px-4 py-3">
                      <p className="text-sm text-text-base">{bond.name}</p>
                      <p className="text-sm font-semibold text-text-base">{bond.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </>
        )}

        {/* 관심 종목 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">관심 종목</h2>
          {stocks.length === 0 ? (
            <EmptyState icon="📌" message="추가된 종목이 없어요" sub="+ 버튼으로 종목을 추가해보세요" />
          ) : (
            <div className="flex flex-col gap-2">
              {stocks.map((stock) => {
                const up = stock.change >= 0;
                return (
                  <Card key={stock.symbol} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-text-base">{stock.name}</p>
                          <span className="text-xs text-text-muted bg-gray-100 px-1.5 py-0.5 rounded">{stock.symbol}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-base font-bold text-text-base">{formatPrice(stock.price, stock.currency)}</p>
                          <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? "text-red-500" : "text-blue-500"}`}>
                            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {up ? "+" : ""}{stock.change.toFixed(2)} ({up ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(stock.symbol)} className="p-2 text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-xs text-text-muted text-center">네이버 금융 / Yahoo Finance 기준</p>
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
            <p className="text-xs text-text-muted mt-1">미국: AAPL · 한국: 005930.KS</p>
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
          <Button onClick={handleAdd} disabled={!formSymbol.trim() || !formName.trim() || saving} className="w-full">
            {saving ? "추가 중..." : "추가하기"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
