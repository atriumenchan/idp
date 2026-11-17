import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f9f9f9",
        paper: "#0b0f1a",
        card: "#131a2a",
        line: "#1e2a45",
        pine: "#00fff7",
        pine2: "#0b0f1a",
        sand: "#9f4eff",
        mute: "#9ca3af",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
