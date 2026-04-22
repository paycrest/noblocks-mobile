/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

interface ThemeColors {
  text: string;
  background: string;
  place_holder: string;
  gray_hover: string;
  secondary: string;
  neutral?: string; // only exists in light
  slate: string;
  white: string;
  surface_overlay: string;
  gray: string;
  tint: string;
  primary: string;
}

export interface GenericColors {
  destructive: string;
  slate: string;
  black: string;
  white: string;
  disabled: string;
  yellow: string;
  olive: string;
  olive2: string;
  red: string;
  orange: string;
  green: string;
  teal: string;
  primary: string;
}

export interface ColorsInterface extends GenericColors {
  light: ThemeColors;
  dark: ThemeColors;
}

export type ThemePalette = ThemeColors & GenericColors;

import { useSelector } from "@/app/store/Store";

// ─── Raw palette ─────────────────────────────────────────────────────────────
// Single source of truth for every hex value in the app.
const palette = {
  primary: "#8B85F4",
  slate: "#5D5DC9",
  white: "white",
  black: "rgba(255, 255, 255, 0.1)",
  destructive: "#F53D6B",
  yellow: "#F2C71C",
  olive: "#61500B",
  olive2: "#917711",
  orange: "#FF7D52",
  green: "#39C65D",
  teal: "#20BA90",
  gray: "rgba(255, 255, 255, 0.10)",
  // light theme
  tintLight: "#0a7ea4",
  textLight: "black",
  backgroundLight: "#ffff",
  placeholderLight: "#A9A9BC",
  grayHoverLight: "#EBEBEF",
  secondaryLight: "#6C6C89",
  neutralLight: "#F9FAFB",
  surfaceOverlayLight: "#ffff",
  // dark theme
  tintDark: "#fff",
  textDark: "#ffff",
  backgroundDark: "#141414",
  placeholderDark: "#FFFFFF33",
  grayHoverDark: "#FFFFFF33",
  secondaryDark: "#FFFFFF80",
  surfaceOverlayDark: "#202020",
} as const;

// ─── Values shared by both themes ────────────────────────────────────────────
const sharedTheme = {
  slate: palette.slate,
  white: palette.white,
  primary: palette.primary,
  gray: palette.gray,
} as const;

export const genericColors: GenericColors = {
  destructive: palette.destructive,
  slate: palette.slate,
  black: palette.black,
  white: palette.white,
  disabled: palette.slate,
  yellow: palette.yellow,
  olive: palette.olive,
  olive2: palette.olive2,
  red: palette.destructive,
  orange: palette.orange,
  green: palette.green,
  teal: palette.teal,
  primary: palette.primary,
};

export const Colors: ColorsInterface = {
  light: {
    ...sharedTheme,
    text: palette.textLight,
    background: palette.backgroundLight,
    place_holder: palette.placeholderLight,
    gray_hover: palette.grayHoverLight,
    secondary: palette.secondaryLight,
    neutral: palette.neutralLight,
    surface_overlay: palette.surfaceOverlayLight,
    tint: palette.tintLight,
  },
  dark: {
    ...sharedTheme,
    text: palette.textDark,
    background: palette.backgroundDark,
    place_holder: palette.placeholderDark,
    gray_hover: palette.grayHoverDark,
    secondary: palette.secondaryDark,
    surface_overlay: palette.surfaceOverlayDark,
    tint: palette.tintDark,
  },
  ...genericColors,
};

export const colors = () => {
  const { appTheme } = useSelector(["appTheme"]);
  if (appTheme === "dark") {
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
