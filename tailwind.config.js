/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(9 55 41)",
        ink: "rgb(42 35 28)",
        parchment: "rgb(247 241 232)",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
