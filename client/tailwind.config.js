/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    screens: {
      "mobile": "375px",
      "tablet": "768px",
      "laptop": "1200px"
    },
    extend: {
      fontFamily: {
        main: ["Nunito"]
      },
      minWidth: {
        "6": "25px",
        "1/12": "8.333333%",
      },
      minHeight: {
        "6": "25px",
        "96": "24rem",
        "80": "20rem",
        "9/10-screen": "90vh",
        "5/6": "83.333333%"
      },
      height: {
        "160": "40rem"
      }
    },
  },
  plugins: [],
}

