export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf8ef",
          100: "#d0eed8",
          200: "#a4ddb5",
          500: "#2e9e5b",
          600: "#1f8a4c",
          700: "#187a3b",
          800: "#145f30",
          900: "#0f4a25",
        },
        saffron: {
          100: "#fdf0cc",
          400: "#f5b729",
          500: "#e3a012",
          700: "#a96f06",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eceef2",
          200: "#d5d9e0",
          300: "#b4bac6",
          400: "#8b93a3",
          500: "#69728a",
          600: "#4d566a",
          700: "#373f52",
          800: "#242a3a",
          900: "#151a26",
        },
        cream: "#fbf8f1",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21, 26, 38, 0.04), 0 2px 8px rgba(21, 26, 38, 0.05)",
        pop: "0 10px 30px rgba(21, 26, 38, 0.14)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
