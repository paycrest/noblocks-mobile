import { useThemeColors } from "@/hooks/useThemeColor";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";

export default function BlurTabBarBackground() {
  const colors = useThemeColors();
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={0} // adjust for stronger/weaker blur
      style={{ flex: 1 }}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
