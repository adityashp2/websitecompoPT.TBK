/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        primary: {
          DEFAULT: '#ffffff',
          dark: '#000000',
          light: '#ffffff',
        },
        ink: '#ffffff',
        body: {
          DEFAULT: '#cccccc',
          strong: '#e6e6e6',
        },
        muted: {
          DEFAULT: '#999999',
          soft: '#666666',
        },
        hairline: {
          DEFAULT: '#262626',
          strong: '#3a3a3a',
        },
        surface: {
          DEFAULT: '#000000',
          soft: '#0d0d0d',
          card: '#141414',
          elevated: '#1f1f1f',
          alt: '#0d0d0d',
        },
        link: '#c3d9f3',
        warning: '#d4a017',
        success: '#5fa657',
        // Preserve legacy aliases safely mapping to Bugatti monochrome
        corp: {
          bg: '#000000',
          alt: '#0d0d0d',
          text: '#ffffff',
          muted: '#999999',
          border: '#262626',
          success: '#5fa657',
        },
        accent: {
          DEFAULT: '#ffffff',
          hover: '#e6e6e6',
        },
        gold: {
          DEFAULT: '#ffffff',
          muted: '#cccccc',
          hover: '#ffffff',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Saira Condensed', 'sans-serif'],
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Garamond', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'sans-serif'],
      },
      letterSpacing: {
        display: '3px',
        wordmark: '6px',
        button: '2.5px',
        caption: '2px',
        hairline: '1.5px',
      },
    },
  },
  plugins: [],
}
