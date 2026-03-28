import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 기기별 breakpoint (기본값 유지 + 커스텀 추가)
      // base(0px)   : Galaxy Fold 접힘 344px 포함
      // xs(375px)   : iPhone 17 Pro / 일반 소형 폰 (NEW)
      // sm(640px)   : Tailwind 기본값 유지
      // md(768px)   : Tailwind 기본값 유지
      // tablet(882px): Galaxy Fold 5/7 펼침 상태 (NEW)
      // lg(1024px)  : 노트북/데스크탑 — 사이드바 등장
      screens: {
        xs: "375px",
        tablet: "882px",
      },
      colors: {
        primary: "#FF8C69",
        "primary-light": "#FFF0EB",
        secondary: "#A8D8EA",
        surface: "#FFF9F5",
        success: "#90D5A8",
        warning: "#FFD580",
        danger: "#FF8080",
        "text-base": "#2D2D2D",
        "text-muted": "#8B8B8B",
      },
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
