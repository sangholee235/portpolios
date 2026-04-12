/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard-Regular", "sans-serif"],
        "pretendard-black": ["Pretendard-Black", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#E6F0FF",
          200: "#B3D1FF",
          300: "#80B3FF",
          400: "#4D94FF",
          500: "#1A75FF", // main primary color
          600: "#0052CC",
          700: "#003D99",
          800: "#002966",
          900: "#001433",
        },
        secondary: {
          100: "#F5F5F5",
          200: "#E0E0E0",
          300: "#CCCCCC",
          400: "#B8B8B8",
          500: "#A3A3A3", // main secondary color
          600: "#8F8F8F",
          700: "#7A7A7A",
          800: "#666666",
          900: "#525252",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontSize: {
        display: ["3.75rem", { lineHeight: "1.2" }], // 60px
        h1: ["4rem", { lineHeight: "1.2" }], // 48px
        h2: ["2.25rem", { lineHeight: "1.3" }], // 36px
        h3: ["1.875rem", { lineHeight: "1.4" }], // 30px
        h4: ["1.5rem", { lineHeight: "1.4" }], // 24px
        h5: ["1.25rem", { lineHeight: "1.4" }], // 20px
        "body-lg": ["1.125rem", { lineHeight: "1.5" }], // 18px
        body: ["1rem", { lineHeight: "1.5" }], // 16px
        "body-sm": ["0.875rem", { lineHeight: "1.5" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.5" }], // 12px
      },
    },
  },
  plugins: [],
};
