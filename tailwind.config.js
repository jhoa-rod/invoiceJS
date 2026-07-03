/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sm: "0 1px 2px rgba(28,22,37,.06), 0 1px 1px rgba(28,22,37,.04)",
        md: "0 10px 30px rgba(28,22,37,.08), 0 2px 8px rgba(28,22,37,.05)",
        lg: "0 24px 60px rgba(28,22,37,.14)",
        soft: "0 10px 30px rgba(28,22,37,.08), 0 2px 8px rgba(28,22,37,.05)",
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
      },
      colors: {
        ink: "#1c1625",
        muted: "#7a6e88",
        surface: "#f7f5fb",
        card: "#ffffff",
        line: "#e7e0f0",
        brand: "#6b5590",
        "brand-deep": "#4a3866",
        "brand-soft": "#f1ecf9",
        gold: "#c9a15a",
        "gold-soft": "#f8efdc",
        positive: "#1f8a5f",
        danger: "#c4443a",
        app: {
          bg: "var(--surface)",
          surface: "var(--card)",
          soft: "var(--brand-soft)",
          border: "var(--line)",
          "border-subtle": "var(--line)",
          text: "var(--ink)",
          muted: "var(--muted)",
          accent: "var(--brand)",
          accentStrong: "var(--brand-deep)",
          positive: "var(--positive)",
          strong: "var(--ink)",
        },
        todo: "#4b6bfb",
        doing: "#f59e0b",
        done: "#16a34a"
      },
      fontFamily: {
        sans: ["Inter", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
