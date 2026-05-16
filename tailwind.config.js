/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#F7F5F0',
        surface: '#FFFFFF',
        ink: '#1B1B17',
        muted: '#6E6E63',
        line: '#E7E3D8',
        brand: {
          DEFAULT: '#134E48',
          dark: '#0D3A35',
          light: '#E4EEEC',
        },
        accent: {
          DEFAULT: '#C9772A',
          light: '#F6EAD9',
        },
        ok: '#2F7D4F',
        warn: '#C9772A',
        bad: '#B5462F',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,27,23,0.04), 0 8px 24px -16px rgba(27,27,23,0.18)',
        lift: '0 12px 40px -20px rgba(27,27,23,0.35)',
      },
      borderRadius: { xl2: '14px' },
    },
  },
  plugins: [],
}
