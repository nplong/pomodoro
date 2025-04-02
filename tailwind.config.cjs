/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'gradient': 'gradient 20s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%': {
            'background-position': '0% 50%',
            'background-size': '400% 400%'
          },
          '25%': {
            'background-position': '100% 50%',
            'background-size': '300% 300%'
          },
          '50%': {
            'background-position': '50% 100%',
            'background-size': '400% 400%'
          },
          '75%': {
            'background-position': '0% 50%',
            'background-size': '300% 300%'
          },
          '100%': {
            'background-position': '50% 0%',
            'background-size': '400% 400%'
          },
        },
      },
    },
  },
  plugins: [],
} 