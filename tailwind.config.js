/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Trust & Tradition: 70% White, 20% Deep Royal Blue, 10% Muted Gold */
        royal: {
          DEFAULT: '#002366',
          50: '#e6ecf5',
          100: '#ccd9eb',
          200: '#99b3d7',
          300: '#668dc3',
          400: '#3367af',
          500: '#002366',
          600: '#001c52',
          700: '#00153d',
          800: '#000e29',
          900: '#000714',
        },
        gold: {
          DEFAULT: '#C5A059',
          50: '#f9f6f0',
          100: '#f2ecdf',
          200: '#e5d9bf',
          300: '#d8c69f',
          400: '#C5A059',
          500: '#b08d47',
          600: '#8a6d38',
          700: '#644e29',
          800: '#3d2f19',
          900: '#17100a',
        },
        charcoal: '#333333',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
}
