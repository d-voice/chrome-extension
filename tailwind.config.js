/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}", "./node_modules/flowbite/**/*.js"],
  darkMode: "media",
  plugins: [
    require('flowbite/plugin')
  ]
}
