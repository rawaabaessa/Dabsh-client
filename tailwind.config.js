/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d8cbe7", 
        primaryDark: "#3b2f63", 
        accent: "#8e44ad", 
        lightBg: "#f3ecf9", 
        borderSoft: "#a99bb7", 
        success: "#27ae60", 
        error: "#e74c3c", 
      },
    },
  },
  plugins: [],
};
