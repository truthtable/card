/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Italiana', 'Cinzel', 'Playfair Display', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        italiana: ['Italiana', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

