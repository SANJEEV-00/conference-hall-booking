/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'dark-glass': 'rgba(0, 0, 0, 0.2)',
        'dark-glass-border': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
