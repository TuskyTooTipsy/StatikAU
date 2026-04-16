/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        abyss: '#0a0a0a',
        obsidian: '#111111',
        graphite: '#1a1a1a',
        gunmetal: '#2a2a2a',
        carbon: '#333333',
        silver: '#c0c0c0',
        bone: '#e0e0e0',
        ash: '#d1d1d1',
        smoke: '#f5f5f5',
        blood: '#8b0000',
        uv: '#2e1a47',
      },
    },
  },
  plugins: [],
};