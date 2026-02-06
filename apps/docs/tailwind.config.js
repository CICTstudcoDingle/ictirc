/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        maroon: {
          DEFAULT: "#800000",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#b91c1c",
          500: "#800000",
          600: "#6b0000",
          700: "#550000",
          800: "#400000",
          900: "#2a0000",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#fefbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#D4AF37",
          500: "#c6a030",
          600: "#a88828",
          700: "#8a6f20",
          800: "#6c5618",
          900: "#4e3d10",
        },
        primary: {
          DEFAULT: "#800000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          foreground: "#1f2937",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transformOrigin: {
        "top-center": "top center",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
