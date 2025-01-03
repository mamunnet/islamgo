/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        bengali: ['Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      colors: {
        'app': {
          'primary': '#4E5BA1',
          'secondary': '#1E2875',
          'accent': {
            'purple': '#7C3AED',
            'indigo': '#4338CA',
            'emerald': '#059669',
            'amber': '#D97706'
          }
        },
        'islamic-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'color': {
          'primary': {
            DEFAULT: '#3c5df8',
            'light': '#7484f6',
            'dark': '#24379c',
          },
          'secondary': {
            DEFAULT: '#4e5ba1',
            'light': '#c8cde3',
            'dark': '#2c3875',
          }
        }
      }
    },
  },
  plugins: [],
}
