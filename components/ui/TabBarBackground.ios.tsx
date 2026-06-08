import { useThemeColors } from "@/hooks/useThemeColor";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

export default function TabBarBackground() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface_canvas,
        borderTopWidth: 0.5,
        borderTopColor: colors.subtle_surface,
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
