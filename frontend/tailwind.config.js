/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // India-inspired palette
        saffron: {
          50: '#fff8f0',
          100: '#fff0db',
          200: '#ffddb3',
          300: '#ffc480',
          400: '#ffa54d',
          500: '#FF9933', // Indian saffron
          600: '#e6852e',
          700: '#cc7029',
          800: '#995420',
          900: '#663818',
        },
        bazaar: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6de',
          300: '#5cebc9',
          400: '#2dd4ad',
          500: '#138d75', // Teal primary
          600: '#0e7060',
          700: '#0b594d',
          800: '#09473d',
          900: '#063529',
        },
        royal: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed', // Royal purple
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b0764',
        },
        clay: {
          50: '#fdf4f3',
          100: '#fce7e4',
          200: '#fad3cd',
          300: '#f5b3a8',
          400: '#ec8575',
          500: '#C0392B', // Terracotta red
          600: '#a63125',
          700: '#8c291f',
          800: '#732219',
          900: '#5a1a13',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typewriter': 'typewriter 2s steps(40) 1s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
