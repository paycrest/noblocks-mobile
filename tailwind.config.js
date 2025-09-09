/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "inter-thin": ["Inter_100Thin"],
        "inter-black": ["Inter_900Black"],
        "inter-regular": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-bold": ["Inter_700Bold"],
        "inter-semi-bold": ["Inter_600SemiBold"],
        "crimson-regular": ["CrimsonPro_400Regular_Italic"],
      },
      colors: {
        "dark-text": "#121217",
        background: "#ffff",
        slate: "#5D5DC9",
        "place-holder": "#A9A9BC",
        "gray-hover": "#EBEBEF",
        secondary: "#6C6C89",
        neutral: "rgba(18, 18, 23, 0.02)",
        gray: "rgba(255, 255, 255, 0.10)",
        "white-text": "#ffff",
        "dark-secondary": "#FFFFFF80",
        "dark-background": "#141414",
        "dark-gray-hover": "#FFFFFF33",
        "dark-place-holder": "#FFFFFF33",
        "accent-gray": "#D1D1DB",
        "accent-gray-bolder": "#F7F7F8",
        danger: "#F53D6B",
      },
      borderRadius: {
        lg: "16px",
      },
    },
  },
  plugins: [],
};
