/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f4b3f',
          light: '#2d6a59',
          dark: '#113025',
        },
        secondary: {
          DEFAULT: '#b18c54',
          light: '#c5a36e',
          dark: '#9a753d',
        },
        accent: '#2ebd85',
        warm: '#faf9f6',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        headers: ['Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}