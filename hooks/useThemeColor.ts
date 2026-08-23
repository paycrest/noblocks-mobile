import { useMemo } from "react";

import { Colors, genericColors, type ThemePalette } from "@/constants/Colors";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

export function useThemeColors(): ThemePalette {
  const scheme = useResolvedTheme();

  return useMemo(
    () => ({
      ...genericColors,
      ...Colors[scheme],
    }),
    [scheme],
  );
}
