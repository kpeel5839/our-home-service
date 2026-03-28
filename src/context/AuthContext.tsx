import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage, initKakao, kakaoLogin } from "@/lib/auth";
import type { FamilyMember } from "@/lib/types";

interface AuthContextValue {
  member: FamilyMember | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    initKakao();

    const restore = async () => {
      const token = authStorage.getToken();
      if (!token) { setLoading(false); return; }
      try {
        const me = await api.get<FamilyMember>("/auth/me");
        setMember(me);
      } catch {
        authStorage.removeToken();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async () => {
    const kakaoToken = await kakaoLogin();
    // 백엔드로 카카오 토큰 전달 → JWT + 멤버 정보 반환
    const { token, member: me } = await api.post<{ token: string; member: FamilyMember }>(
      "/auth/kakao",
      { accessToken: kakaoToken }
    );
    authStorage.setToken(token);
    setMember(me);
  };

  const logout = () => {
    authStorage.removeToken();
    if (typeof window.Kakao !== "undefined") {
      window.Kakao.Auth.logout();
    }
    setMember(null);
  };

  return (
    <AuthContext.Provider value={{ member, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
