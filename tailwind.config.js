/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // İleride Tailwind class'ları kullanmak istersen diye renklerimizi buraya ekledim
        primary: '#008A79',
        secondary: '#F2FAF9',
        background: '#F4F4F4',
        textDark: '#212121',
      }
    },
  },
  plugins: [],
}