/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        primary: {
          50: '#E8F3FF',
          100: '#B9DBFF',
          200: '#8AC2FF',
          300: '#5BA9FF',
          400: '#2C90FF',
          500: '#165DFF',
          600: '#0E42D2',
          700: '#0A2BA6',
          800: '#061A7A',
          900: '#030D4E'
        },
        success: {
          50: '#E8FFEA',
          100: '#B3FFBB',
          200: '#80FF8D',
          300: '#4DFF5E',
          400: '#1AFF30',
          500: '#00B42A',
          600: '#008F1F',
          700: '#006A16',
          800: '#00450E',
          900: '#002006'
        },
        warning: {
          50: '#FFF2E6',
          100: '#FFD6B3',
          200: '#FFBA80',
          300: '#FF9E4D',
          400: '#FF821A',
          500: '#FF7D00',
          600: '#CC6400',
          700: '#994B00',
          800: '#663200',
          900: '#331900'
        },
        danger: {
          50: '#FFE8E8',
          100: '#FFB3B3',
          200: '#FF8080',
          300: '#FF4D4D',
          400: '#FF1A1A',
          500: '#F53F3F',
          600: '#CB2634',
          700: '#A11828',
          800: '#770E1E',
          900: '#4D0814'
        }
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'nav': '0 1px 2px rgba(0, 0, 0, 0.06)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
};
