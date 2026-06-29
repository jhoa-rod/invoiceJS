/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        surface: "#f8f5fb",
        ink: "#30283a",
        muted: "#6f617c",
        line: "#d7cbe3",
        brand: "#75638f",
        app: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          soft: "var(--color-soft)",
          border: "var(--color-border)",
          "border-subtle": "var(--color-border-subtle)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          accent: "var(--color-accent)",
          accentStrong: "var(--color-accent-strong)",
          positive: "var(--color-positive)",
          strong: "var(--color-strong)",
        },
        todo: "#4b6bfb",
        doing: "#f59e0b",
        done: "#16a34a"
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
