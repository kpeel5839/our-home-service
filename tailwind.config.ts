import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        sans: ["var(--font-noto)", "sans-serif"],
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
