/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ["Nunito"]
      },
      minWidth: {
        "6": "25px"
      },
      minHeight: {
        "6": "25px"
      }
    },
  },
  plugins: [],
}

