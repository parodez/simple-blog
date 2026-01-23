/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#136dec",
        "surface-light": "#ffffff",
        "surface-dark": "#101822",
        "text-main": "#111418",
        "text-muted": "#617289",
        "background-light": "#f6f7f8",
        "background-dark": "#101822",
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
        display: ["Work Sans", "sans-serif"],
        serif: ["Lora", "serif"],
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],

}

