/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060814',
          900: '#0B0F19',
          800: '#161E31',
          700: '#1E293B',
          600: '#334155',
        },
        sports: {
          green: '#10B981',
          greenLight: '#34D399',
          greenDark: '#059669',
          yellow: '#F59E0B',
          yellowLight: '#FBBF24',
          yellowDark: '#D97706',
          red: '#EF4444',
          blue: '#3B82F6',
          blueDark: '#2563EB',
          gray: '#94A3B8',
          border: '#1E293B',
          card: '#161D30',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
