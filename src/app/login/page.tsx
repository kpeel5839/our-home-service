import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await login();
      navigate("/", { replace: true });
    } catch (e) {
      setError("로그인에 실패했어요. 다시 시도해주세요.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-12 text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <img src="/favicon.svg" alt="우리 집 로고" className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold text-text-base">우리 집 🏠</h1>
        <p className="text-text-muted mt-2">가족을 위한 생활 관리 서비스</p>
      </div>

      {/* 기능 소개 */}
      <div className="w-full max-w-sm mb-10 space-y-3">
        {[
          { icon: "🍚", text: "오늘의 메뉴 & 냉장고 재고 관리" },
          { icon: "🚗", text: "차량 예약 & 주차 위치 알림" },
          { icon: "🧹", text: "쓰레기 · 청소 담당 자동 알림" },
          { icon: "📸", text: "가족 피드로 일상 공유" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <span className="text-xl">{item.icon}</span>
            <p className="text-sm text-text-base">{item.text}</p>
          </div>
        ))}
      </div>

      {/* 카카오 로그인 버튼 */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-semibold rounded-2xl py-4 text-base active:opacity-80 transition-opacity disabled:opacity-60 shadow-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin" />
          ) : (
            <>
              {/* 카카오 로고 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.703 5.076 4.285 6.51-.168.614-.542 2.226-.62 2.572-.096.43.158.424.333.308.137-.092 2.18-1.473 3.063-2.068.294.041.593.062.939.062 5.523 0 10-3.477 10-7.784C20 6.477 17.523 3 12 3z"
                  fill="#191919"
                />
              </svg>
              카카오로 시작하기
            </>
          )}
        </button>

        {error && (
          <p className="text-center text-sm text-danger">{error}</p>
        )}

        <p className="text-center text-xs text-text-muted leading-relaxed">
          로그인 시 가족 그룹에 참여하거나<br />새로운 그룹을 만들 수 있어요
        </p>
      </div>
    </div>
  );
}
