const TOKEN_KEY = "our_home_token";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};

/** 카카오 SDK 초기화 (한 번만 실행) */
export function initKakao() {
  if (typeof window.Kakao === "undefined") return;
  if (!window.Kakao.isInitialized()) {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key) { console.error("VITE_KAKAO_JS_KEY 환경변수가 없습니다."); return; }
    window.Kakao.init(key);
  }
}

/** 카카오 로그인 페이지로 리다이렉트 (SDK 2.x authorize 방식) */
export function kakaoRedirect(): void {
  window.Kakao.Auth.authorize({
    redirectUri: `${window.location.origin}/oauth/callback`,
  });
}
