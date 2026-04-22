import { useEffect, useState } from "react";

import { useSelector } from "@/app/store/Store";
import { Colors, genericColors, type ThemePalette } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export function useThemeColors(): ThemePalette {
  const { appTheme } = useSelector(["appTheme"]);
  const systemTheme = useColorScheme();
  const [scheme, setScheme] = useState<"light" | "dark">("dark"); // default fallback

  useEffect(() => {
    const resolved =
      appTheme === "system"
        ? (systemTheme ?? "dark") // fallback to dark if null
        : appTheme;

    setScheme(resolved);
  }, [appTheme, systemTheme]);

  return {
    ...genericColors,
    ...Colors[scheme],
  };
}
