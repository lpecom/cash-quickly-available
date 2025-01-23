import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F8FAFC",
        foreground: "#1E293B",
        primary: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F8FAFC",
          foreground: "#1E293B",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E2E8F0",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#D946EF",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.9)",
          foreground: "#1E293B",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
          border: "#E2E8F0",
          ring: "#8B5CF6",
          accent: "#F1F5F9",
          "accent-foreground": "#0F172A",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;