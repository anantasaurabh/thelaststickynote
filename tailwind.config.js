/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          red: '#fca5a5',
          orange: '#fdba74',
          amber: '#fcd34d',
          yellow: '#fde047',
          lime: '#bef264',
          green: '#86efac',
          emerald: '#6ee7b7',
          teal: '#5eead4',
          cyan: '#67e8f9',
          sky: '#7dd3fc',
          indigo: '#a5b4fc',
          violet: '#c4b5fd',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-pastel-red',
    'bg-pastel-orange',
    'bg-pastel-amber',
    'bg-pastel-yellow',
    'bg-pastel-lime',
    'bg-pastel-green',
    'bg-pastel-emerald',
    'bg-pastel-teal',
    'bg-pastel-cyan',
    'bg-pastel-sky',
    'bg-pastel-indigo',
    'bg-pastel-violet',
    'bg-rose-200',
  ],
}
