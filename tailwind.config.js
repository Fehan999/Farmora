module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f8f1", 100: "#dcefdc", 200: "#bbdfbc", 300: "#8dc78f",
          400: "#5ba95f", 500: "#3a8c3f", 600: "#2b7031", 700: "#245929",
          800: "#204824", 900: "#1b3c1f",
        },
        earth: { 50: "#fbf7f0", 100: "#f4ead7", 400: "#d4a35a", 500: "#c4873a", 600: "#a86b2c" },
      },
      fontFamily: { display: ["Georgia", "serif"] },
    },
  },
  plugins: [],
};
