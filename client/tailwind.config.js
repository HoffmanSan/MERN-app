/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ["Nunito"]
      },
      minWidth: {
        "6": "25px",
        "1/12": "8.333333%"
      },
      minHeight: {
        "6": "25px"
      }
    },
  },
  plugins: [],
}

