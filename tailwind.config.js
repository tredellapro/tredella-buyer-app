/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e94560",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#2b3445",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#ffffff",
          primary: "#e94560",
          secondary: "#2b3445",
          light: "#f6f9fc",
          dark: "#000000",
          accent: "#697282",
          white: "#ffffff",
        },
        foreground: "#171717",
        text: {
          primary: "#e94560",
          secondary: "#2b3445",
          light: "#f6f9fc",
          dark: "#000000",
          accent: "#697282",
          white: "#ffffff",
        },
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        border: {
          DEFAULT: "#ccd3e1",
          primary: "#e94560",
          secondary: "#ccd3e1",
          purple: "#9747ff",
          light: "#f6f9fc",
          dark: "#000000",
          accent: "#697282",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Poppins_400Regular", "sans-serif"],
        medium: ["Poppins_500Medium", "sans-serif"],
        semibold: ["Poppins_600SemiBold", "sans-serif"],
        bold: ["Poppins_700Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
