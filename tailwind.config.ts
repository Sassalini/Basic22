import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brg: {
          bg: "var(--background)",
          panel: "var(--panel)",
          panelSoft: "var(--panel-soft)",
          accent: "var(--accent)",
          accentHover: "var(--accent-hover)",
          text: "var(--foreground)",
          muted: "var(--muted)",
          border: "var(--border)"
        }
      },
      boxShadow: {
        calm: "0 18px 60px rgba(0, 0, 0, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
