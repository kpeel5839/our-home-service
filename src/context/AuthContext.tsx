import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authStorage, initKakao, kakaoRedirect } from "@/lib/auth";

interface AuthUser {
  kakaoId: string;
  memberId: string | null;
  nickname: string;
  profileImageUrl: string | null;
}

interface AuthContextValue {
  member: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    initKakao();

    const restore = async () => {
      const rawToken = authStorage.getToken();
      const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
      if (!token) { authStorage.removeToken(); setLoading(false); return; }
      try {
        const me = await api.get<AuthUser>("/auth/me");
        setMember(me);
      } catch {
        authStorage.removeToken();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = () => {
    kakaoRedirect();
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
