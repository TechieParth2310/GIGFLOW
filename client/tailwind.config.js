/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Orange + Ivory Design System
        brand: {
          DEFAULT: '#F97316',
          deep: '#EA580C',
          tint: 'rgba(249, 115, 22, 0.12)',
          light: '#FFEDD5',
          lighter: '#FFF7ED',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2937',
        },
        text: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          light: '#64748B',
        },
        border: {
          DEFAULT: 'rgba(15, 23, 42, 0.08)',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'page-enter': 'pageEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        'card-hover': 'cardHover 0.3s ease-out',
        'button-glow': 'buttonGlow 2s ease-in-out infinite',
      },
      animationDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        pageEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
            filter: 'blur(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
            filter: 'blur(0)',
          },
        },
        cardHover: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-6px)',
          },
        },
        buttonGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
}
