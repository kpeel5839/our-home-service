interface KakaoAuthObj {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface Window {
  Kakao: {
    init(key: string): void;
    isInitialized(): boolean;
    Auth: {
      login(options: {
        success: (authObj: KakaoAuthObj) => void;
        fail: (err: unknown) => void;
        scope?: string;
      }): void;
      logout(callback?: () => void): void;
    };
  };
}
