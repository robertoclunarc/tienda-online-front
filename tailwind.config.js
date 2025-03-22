module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E6ECF5',
          200: '#CDDAEA',
          300: '#9BB2D1',
          400: '#6A8AB8',
          500: '#39629F',
          600: '#1A3870', // Color principal Cecomsa
          700: '#142E56',
          800: '#0F233D',
          900: '#0A1928',
        },
        secondary: {
          100: '#FCE4F0',
          200: '#F9C9E1',
          300: '#F397C8',
          400: '#ED66AF',
          500: '#E73496',
          600: '#E6007E', // Color secundario Cecomsa (magenta)
          700: '#B80064',
          800: '#8A004B',
          900: '#5C0032',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};