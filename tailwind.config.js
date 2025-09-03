/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1710E1",
        secondary: "#02052F",
        textColor: "#3D4C5E",
        lightGray: "#F5F7F9",
        vividBlue: "#5B38DB",
        lightBlueGray: "#F2F4F7",
        green: "#096A30",
        whatsappGreen: "#0A7937",
        fadedGreen: "#E7F7ED",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        shake: "shake 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
