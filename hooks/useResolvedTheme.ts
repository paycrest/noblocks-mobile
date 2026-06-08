import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { useSelector } from "@/store/Store";

export type ResolvedTheme = "light" | "dark";

export function useResolvedTheme(): ResolvedTheme {
  const { appTheme } = useSelector(["appTheme"]);
  const systemTheme = useColorScheme();

  return useMemo(() => {
    if (appTheme === "system") {
      return systemTheme ?? "dark";
    }
    return appTheme;
  }, [appTheme, systemTheme]);
}
