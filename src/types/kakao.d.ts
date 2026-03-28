interface Window {
  Kakao: {
    init(key: string): void;
    isInitialized(): boolean;
    Auth: {
      authorize(options: {
        redirectUri: string;
        scope?: string;
        state?: string;
        nonce?: string;
      }): void;
      logout(callback?: () => void): void;
    };
  };
}
