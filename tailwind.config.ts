import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#F3EEE4",
        card: "#FFFCF7",
        line: "#E4D8C6",
        pine: "#1B6B72",
        pine2: "#FFFCF7",
        sand: "#9A7340",
        mute: "#5C6874",
        navy: "#12263C",
        ivory: "#F7F1E6",
        gold: "#C6A15A",
        danger: "#8E2F2F",
        ok: "#1D6B45",
        warn: "#8A5A12",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 24px 60px -28px rgba(18, 38, 60, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
