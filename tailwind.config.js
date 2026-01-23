/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Active le mode sombre basé sur la classe
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.4', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.3', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.045em' }],
      },
    },
  },
  plugins: [],
}

