import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 핸드폰 접속용 (0.0.0.0)
    port: 3000,
    proxy: {
      // /api 로 시작하는 요청은 백엔드(localhost:8080)로 프록시
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
