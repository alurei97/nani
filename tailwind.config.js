/** @type {import('tailwindcss').Config} */
const colors = require("./src/constants/colors.json");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito_400Regular"],
        "nunito-extrabold": ["Nunito_800ExtraBold"],
      },
      colors: {
        ...colors,
        status: {
          planned: "#888888",
          watching: colors.score,
          completed: "#4ade80",
        },
      },
    },
  },
  plugins: [],
};
