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
        gold: {
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EBDDBF',
          300: '#DFC897',
          400: '#CDB16B',
          500: '#B88E3F',
          600: '#9E7528',
          700: '#7E5B1E',
          800: '#5E4316',
          900: '#3F2C0E',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FBF9F5',
          200: '#F3EFE6',
          300: '#E8E1D3',
        },
        dark: {
          DEFAULT: '#0E1013',
          card: '#16191E',
          surface: '#1E232B',
          border: '#2A303C',
          muted: '#8E95A5',
        }
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
