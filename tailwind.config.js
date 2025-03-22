/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5DD3", // Purple from our mockup
          light: "#B19DFF",
          dark: "#3F254F",
        },
        accent: {
          DEFAULT: "#F5C05B", // Gold/yellow from our mockup
          light: "#F8D78B",
        },
        dark: {
          DEFAULT: "#121212",
          lighter: "#1E1E1E",
          card: "#2A2A2A",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Quicksand", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} 