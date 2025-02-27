/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          25: "rgba(89, 13, 130, 0.25)",
          50: "rgba(89, 13, 130, 0.50)",
          75: "rgba(89, 13, 130, 0.75)",
          100: "rgba(89, 13, 130, 1)",
        },
        secondary: "var(--secondary)",
        tertiary: {
          DEFAULT: "var(--tertiary)",
          5: "rgba(122, 49, 139, 0.05)",
          10: "rgba(122, 49, 139, 0.10)",
          25: "rgba(122, 49, 139, 0.25)",
          50: "rgba(122, 49, 139, 0.50)",
          75: "rgba(122, 49, 139, 0.75)",
        },
      },
      fontSize: {
        reguler: "18px",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
