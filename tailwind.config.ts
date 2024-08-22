import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
    },
    colors: {
      primary: "#fff",
      secondary: "#fff",
      white: "#ffffff",
      black: "#111111",
      "gray-1": "#F5F5F5",
      "gray-2": "#E0E0E0",
      "gray-3": "#B8B8B8",
      "gray-4": "#727272",
    },
    extend: {
      screens: {
        xxl: "1600px",
        ...defaultTheme.screens,
      },
      borderRadius: {
        DEFAULT: ".8rem",
      },
    },
  },
  plugins: [],
};

export default config;
