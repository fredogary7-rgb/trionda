// @ts-check
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e8eeff", 100: "#b8ccff", 200: "#88aaff", 300: "#5888ff",
          400: "#2866ff", 500: "#0047CC", 600: "#0039a6", 700: "#002b80",
          800: "#001d5a", 900: "#000f34",
        },
        accent: {
          50: "#e0ebff", 100: "#b3cdff", 200: "#80aeff", 300: "#4d8fff",
          400: "#1a70ff", 500: "#3388FF", 600: "#2970d9", 700: "#1f58b3",
          800: "#15408c", 900: "#0b2866",
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
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};