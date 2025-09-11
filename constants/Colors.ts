/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { colorScheme } from "nativewind";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const genericColors = {
  destructive: "#F53D6B",
  slate: "#5D5DC9",
  black: "rgba(255, 255, 255, 0.1)",
  white: "white",
  disabled: "#5D5DC9",
};

export const Colors = {
  light: {
    text: "black",
    background: "#ffff",
    place_holder: "#A9A9BC",
    gray_hover: "#EBEBEF",
    secondary: "#6C6C89",
    neutral: "#F9FAFB",
    slate: "#5D5DC9",
    white: "white",
    surface_overlay: "#ffff",
    gray: "rgba(255, 255, 255, 0.10)",
    tint: tintColorLight,
  },
  dark: {
    text: "#ffff",
    secondary: "#FFFFFF80",
    background: "#141414",
    gray_hover: "#FFFFFF33",
    place_holder: "#FFFFFF33",
    slate: "#5D5DC9",
    white: "white",
    surface_overlay: "#202020",
    tint: tintColorDark,
    gray: "rgba(255, 255, 255, 0.10)",
  },
  ...genericColors,
};

export const colors = () => {
  const colorscheme = colorScheme.get();
  if (colorscheme === "dark") {
    return {
      ...genericColors,
      ...Colors.dark,
    };
  }
  return {
    ...genericColors,
    ...Colors.light,
  };
};
