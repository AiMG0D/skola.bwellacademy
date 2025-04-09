const colors = require('./src/colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: Object.assign({}, colors.purple),
        purple: Object.assign({}, colors.purple),
        green: Object.assign({}, colors.green),
        yellow: Object.assign({}, colors.yellow),
        blue: Object.assign({}, colors.blue),
      },
      gridTemplateColumns: {
        'header': '1fr 3fr 1fr',
      },
    },
  },
  plugins: [],
}
