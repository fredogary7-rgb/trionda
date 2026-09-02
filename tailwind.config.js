// @ts-check
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf2ff", 100: "#d4e0ff", 200: "#a8c2ff", 300: "#7da3ff",
          400: "#5185ff", 500: "#0D47C7", 600: "#0a3aa5", 700: "#082B6F",
          800: "#051d4a", 900: "#031230",
        },
        primary: {
          50: "#eaf2ff", 100: "#d4e0ff", 200: "#a8c2ff", 300: "#7da3ff",
          400: "#5185ff", 500: "#0D47C7", 600: "#0a3aa5", 700: "#082B6F",
          800: "#051d4a", 900: "#031230",
        },
        accent: {
          50: "#eaf2ff", 100: "#d4e0ff", 200: "#a8c2ff", 300: "#7da3ff",
          400: "#5185ff", 500: "#0D47C7", 600: "#0a3aa5", 700: "#082B6F",
          800: "#051d4a", 900: "#031230",
        },
        flame: {
          50: "#ffeaea", 100: "#ffb3b3", 200: "#ff8080", 300: "#ff4d4d",
          400: "#ff1a1a", 500: "#FF3B30", 600: "#d93025", 700: "#b3251b",
          800: "#8c1a10", 900: "#660f05",
        },
        gold: {
          50: "#fff8e6", 100: "#ffedb3", 200: "#fde280", 300: "#fad64d",
          400: "#f8cb1a", 500: "#F0A500", 600: "#c98a00", 700: "#a26f00",
          800: "#7b5400", 900: "#543900",
        },
        surface: {
          DEFAULT: "#F5F8FC",
          50: "#FFFFFF",
          100: "#F5F8FC",
          200: "#EDF1F7",
          300: "#E2E8F0",
          400: "#CBD5E1",
        },
        text: {
          primary: "#102A56",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "28px",
      },
    },
  },
  plugins: [],
};