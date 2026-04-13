/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#800000",
          600: "#6b0000",
          700: "#550000",
        },
        gold: {
          DEFAULT: "#D4AF37",
        },
      },
    },
  },
  plugins: [],
};
