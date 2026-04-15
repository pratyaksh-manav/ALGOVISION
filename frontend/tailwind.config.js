/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        panel: "#fffdf8",
        peach: "#f97316",
        sand: "#f3e8d3",
        sky: "#0ea5e9"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        float: "0 18px 45px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
