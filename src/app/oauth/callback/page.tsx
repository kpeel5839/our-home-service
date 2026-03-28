import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { FamilyMember } from "@/lib/types";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setError("인증 코드를 받지 못했어요.");
      return;
    }

    const finish = async () => {
      try {
        const { token } = await api.post<{ token: string; member: FamilyMember }>(
          "/auth/kakao",
          { code }
        );
        authStorage.setToken(token);
        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        setError("로그인에 실패했어요. 다시 시도해주세요.");
      }
    };

    finish();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <p className="text-danger text-sm">{error}</p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="text-primary text-sm underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
