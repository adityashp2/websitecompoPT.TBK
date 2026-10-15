/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F3EFE6',
          warm: '#F3EFE6',
          light: '#FAF7F0',
        },
        charcoal: {
          DEFAULT: '#262722',
          light: '#32332D',
          dark: '#1B1C18',
        },
        gold: {
          DEFAULT: '#C5A568',
          muted: '#C5A568',
          hover: '#B69455',
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EBDDBF',
          300: '#DFC897',
          400: '#CDB16B',
          500: '#C5A568',
          600: '#B69455',
          700: '#937438',
          800: '#6C5424',
          900: '#483715',
        },
        stone: {
          gray: '#77766F',
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#77766F',
          600: '#5C5B55',
          700: '#44433E',
        },
        subtle: {
          border: '#DDD8CE',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF8F4',
          200: '#F3EFE6',
          300: '#E7E1D4',
        },
        dark: {
          DEFAULT: '#262722',
          card: '#1F201C',
          surface: '#2C2D27',
          border: '#3A3C34',
          muted: '#8A8981',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
