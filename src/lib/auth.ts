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

/** 카카오 팝업 로그인 → access_token 반환 */
export function kakaoLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    window.Kakao.Auth.login({
      success: (authObj) => resolve(authObj.access_token),
      fail: reject,
    });
  });
}
