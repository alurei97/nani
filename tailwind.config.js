/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        app: "#0d0d0f",
        accent: "#a855f7",
        status: {
          planned: "#888888",
          watching: "#fbbf24",
          completed: "#4ade80",
        },
      },
    },
  },
  plugins: [],
};
