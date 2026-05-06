/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

interface ThemeColors {
  text: string;
  background: string;
  place_holder: string;
  gray_hover: string;
  subtle_surface: string;
  secondary: string;
  neutral?: string; // only exists in light
  slate: string;
  white: string;
  neutral_surface: string;
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
  success: string;
  teal: string;
  primary: string;
  lavendar: string;
  place_holder2: string;
  primary_2: string;
  primary_9: string;
  gray2: string;
  white_10: string;
  white_5: string;
}
export interface ColorsInterface extends GenericColors {
  light: ThemeColors;
  dark: ThemeColors;
  neutral_surface: string;
  subtle_surface: string;
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
  success: "#227738",
  teal: "#20BA90",
  gray: "rgba(255, 255, 255, 0.10)",
  gray2: "#FFFFFF0D",
  lavendar: "#A9A5F6",
  place_holder2: `rgba(255, 255, 255, 0.3)`,
  primary_2: "rgba(139, 133, 244, 0.14)",
  primary_9: "#8B85F417",
  neutral_surface: "#FFFFFF0D",

  // light theme
  tintLight: "#0a7ea4",
  textLight: "black",
  backgroundLight: "#ffff",
  placeholderLight: "#A9A9BC",
  grayHoverLight: "#EBEBEF",
  subtleSurfaceLight: "#FFFFFF1A",
  secondaryLight: "#6C6C89",
  neutralLight: "#F9FAFB",
  surfaceOverlayLight: "#ffff",
  // dark theme
  tintDark: "#fff",
  textDark: "#ffff",
  backgroundDark: "#141414",
  placeholderDark: "#FFFFFF33",
  grayHoverDark: "#FFFFFF33",
  subtleSurfaceDark: "#FFFFFF1A",
  secondaryDark: "#FFFFFF80",
  surfaceOverlayDark: "#202020",
  white_10: "FFFFFF1A",
  white_5: "FFFFFF0D",
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
  success: palette.success,
  teal: palette.teal,
  primary: palette.primary,
  lavendar: palette.lavendar,
  place_holder2: palette.place_holder2,
  gray2: palette.gray2,
  white_10: palette.white_10,
  primary_2: palette.primary_2,
  primary_9: palette.primary_9,
  white_5: palette.white_5,
};

export const Colors: ColorsInterface = {
  neutral_surface: palette.neutral_surface,
  subtle_surface: palette.subtleSurfaceDark,
  light: {
    ...sharedTheme,
    text: palette.textLight,
    background: palette.backgroundLight,
    place_holder: palette.placeholderLight,
    gray_hover: palette.grayHoverLight,
    subtle_surface: palette.subtleSurfaceLight,
    secondary: palette.secondaryLight,
    neutral: palette.neutralLight,
    neutral_surface: palette.surfaceOverlayLight,
    tint: palette.tintLight,
  },
  dark: {
    ...sharedTheme,
    text: palette.textDark,
    background: palette.backgroundDark,
    place_holder: palette.placeholderDark,
    gray_hover: palette.grayHoverDark,
    subtle_surface: palette.subtleSurfaceDark,
    secondary: palette.secondaryDark,
    neutral_surface: palette.surfaceOverlayDark,
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
