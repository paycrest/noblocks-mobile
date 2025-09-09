import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColors() {
  const scheme = useColorScheme();
  return Colors[scheme ?? "dark"];
}
