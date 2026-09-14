import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17181a",
        sidebar: "#111214",
        blue: "#7e9bb0",
        gold: "#b39264",
        cream: "#f2f2f1",
        ok: "#6c8f6a",
        danger: "#b25c50",
      },
      fontFamily: {
        sans: ["Jost", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      borderRadius: { card: "16px" },
    },
  },
  plugins: [],
};
export default config;
