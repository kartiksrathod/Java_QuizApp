/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Custom color palette for true dark and clean light themes
        dark: {
          bg: '#0a0a0a',
          'bg-secondary': '#111111',
          'bg-tertiary': '#1a1a1a',
          border: '#262626',
          text: '#e5e5e5',
          'text-secondary': '#a3a3a3',
        },
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f9fafb',
          'bg-tertiary': '#f3f4f6',
          border: '#e5e7eb',
          text: '#111827',
          'text-secondary': '#6b7280',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
